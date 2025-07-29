import React, { useState, useEffect } from 'react';
import { FaInstagram, FaPlus, FaEdit, FaTrash, FaExternalLinkAlt, FaImage } from 'react-icons/fa';
import API from '../api/axios';
import AddInstagramPostModal from '../components/instagram/AddInstagramPostModal';
import EditInstagramPostModal from '../components/instagram/EditInstagramPostModal';
import LoadingSpinner from '../components/ui/LoadingSpinner';

interface InstagramPost {
  id: number;
  title: string;
  caption: string;
  instagram_url: string;
  image_urls: string[];
  price: number;
  instagram_id: string;
  username: string;
  likes_count: number;
  posted_at: string;
  status: 'active' | 'sold' | 'hidden';
  created_at: string;
  image_count: number;
  first_image: string;
}

const statusStyle = {
  active: 'badge badge-success',
  sold: 'badge badge-warning',
  hidden: 'badge badge-error'
};

const statusLabel = {
  active: 'Đang bán',
  sold: 'Đã bán',
  hidden: 'Đã ẩn'
};

const InstagramPosts: React.FC = () => {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await API.get('/instagram-posts');
      setPosts(response.data.posts);
    } catch (err: any) {
      setError('Không thể tải danh sách bài viết');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPost = (newPost: InstagramPost) => {
    setPosts(prev => [newPost, ...prev]);
    setShowAddModal(false);
  };

  const handleEditPost = (post: InstagramPost) => {
    setSelectedPost(post);
    setShowEditModal(true);
  };

  const handleUpdatePost = (updatedPost: InstagramPost) => {
    setPosts(prev => prev.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    ));
    setShowEditModal(false);
    setSelectedPost(null);
  };

  const handleDeletePost = async (post: InstagramPost) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      return;
    }

    try {
      await API.delete(`/instagram-posts/${post.id}`);
      setPosts(prev => prev.filter(p => p.id !== post.id));
    } catch (err: any) {
      alert('Không thể xóa bài viết');
      console.error('Error deleting post:', err);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (loading) {
    return <LoadingSpinner message="Đang tải bài viết..." fullScreen />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FaInstagram className="text-pink-500" />
            Quản lý bài viết Instagram
          </h1>
          <p className="text-gray-600 mt-1">
            Quản lý và bán hàng từ các bài viết Instagram
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary gap-2"
        >
          <FaPlus />
          Thêm bài viết
        </button>
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <FaInstagram className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-500 mb-2">
            Chưa có bài viết nào
          </h3>
          <p className="text-gray-400 mb-4">
            Thêm link Instagram để bắt đầu quản lý bài viết
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary"
          >
            Thêm bài viết đầu tiên
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Hình ảnh</th>
                <th>Tiêu đề</th>
                <th>Username</th>
                <th>Số ảnh</th>
                <th>Giá</th>
                <th>Trạng thái</th>
                <th>Ngày thêm</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img
                            src={post.first_image || '/placeholder-image.jpg'}
                            alt={post.title}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder-image.jpg';
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div className="font-bold text-sm line-clamp-2">
                        {post.title || 'Không có tiêu đề'}
                      </div>
                      <div className="text-sm opacity-50 line-clamp-1">
                        {post.caption && post.caption.substring(0, 50)}...
                      </div>
                    </div>
                  </td>
                  <td>
                    <a
                      href={post.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link link-primary flex items-center gap-1"
                    >
                      @{post.username}
                      <FaExternalLinkAlt className="text-xs" />
                    </a>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <FaImage className="text-gray-400" />
                      <span>{post.image_count}</span>
                    </div>
                  </td>
                  <td>
                    <span className="font-mono">
                      {post.price > 0 ? formatPrice(post.price) : 'Chưa định giá'}
                    </span>
                  </td>
                  <td>
                    <span className={statusStyle[post.status]}>
                      {statusLabel[post.status]}
                    </span>
                  </td>
                  <td>{formatDate(post.created_at)}</td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditPost(post)}
                        className="btn btn-ghost btn-xs"
                        title="Chỉnh sửa"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeletePost(post)}
                        className="btn btn-ghost btn-xs text-error"
                        title="Xóa"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      {showAddModal && (
        <AddInstagramPostModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handleAddPost}
        />
      )}

      {showEditModal && selectedPost && (
        <EditInstagramPostModal
          post={selectedPost}
          onClose={() => {
            setShowEditModal(false);
            setSelectedPost(null);
          }}
          onSuccess={handleUpdatePost}
        />
      )}
    </div>
  );
};

export default InstagramPosts;
