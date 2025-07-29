<?php

namespace App\Http\Controllers;

use App\Models\InstagramPost;
use App\Services\InstagramCrawlerService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class InstagramPostController extends Controller
{
    protected $crawlerService;

    public function __construct(InstagramCrawlerService $crawlerService)
    {
        $this->middleware('auth:sanctum');
        $this->crawlerService = $crawlerService;
    }

    /**
     * Get all Instagram posts for current user
     */
    public function index(): JsonResponse
    {
        $posts = InstagramPost::with('user')
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'posts' => $posts
        ]);
    }

    /**
     * Crawl Instagram post by URL
     */
    public function crawl(Request $request): JsonResponse
    {
        $request->validate([
            'url' => 'required|url|regex:/instagram\.com\/(p|reel|tv)\/[A-Za-z0-9_-]+/'
        ]);

        try {
            // Check if URL already exists
            $existingPost = InstagramPost::where('instagram_url', $request->url)->first();
            if ($existingPost) {
                return response()->json([
                    'success' => false,
                    'message' => 'Bài viết này đã được thêm trước đó'
                ], 422);
            }

            // Crawl Instagram data
            $crawledData = $this->crawlerService->crawlPost($request->url);

            // Create new post
            $post = InstagramPost::create([
                'title' => $crawledData['title'],
                'caption' => $crawledData['caption'],
                'instagram_url' => $request->url,
                'image_urls' => $crawledData['image_urls'],
                'instagram_id' => $crawledData['instagram_id'],
                'username' => $crawledData['username'],
                'likes_count' => $crawledData['likes_count'],
                'posted_at' => $crawledData['posted_at'],
                'user_id' => Auth::id(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Đã thêm bài viết Instagram thành công!',
                'post' => $post->load('user')
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể lấy thông tin bài viết: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update Instagram post
     */
    public function update(Request $request, InstagramPost $post): JsonResponse
    {
        // Check ownership
        if ($post->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Không có quyền chỉnh sửa bài viết này'
            ], 403);
        }

        $request->validate([
            'title' => 'sometimes|string|max:255',
            'price' => 'sometimes|numeric|min:0',
            'status' => 'sometimes|in:active,sold,hidden'
        ]);

        $post->update($request->only(['title', 'price', 'status']));

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật bài viết thành công!',
            'post' => $post->fresh()
        ]);
    }

    /**
     * Delete Instagram post
     */
    public function destroy(InstagramPost $post): JsonResponse
    {
        // Check ownership
        if ($post->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Không có quyền xóa bài viết này'
            ], 403);
        }

        $post->delete();

        return response()->json([
            'success' => true,
            'message' => 'Đã xóa bài viết thành công!'
        ]);
    }

    /**
     * Get single Instagram post
     */
    public function show(InstagramPost $post): JsonResponse
    {
        return response()->json([
            'success' => true,
            'post' => $post->load('user')
        ]);
    }
}
