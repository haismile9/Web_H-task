import React, { useState } from 'react';
import { FaInstagram, FaTimes, FaSave } from 'react-icons/fa';
import API from '../../api/axios';

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

interface Props {
  post: InstagramPost;
  onClose: () => void;
  onSuccess: (post: InstagramPost) => void;
}

const EditInstagramPostModal: React.FC<Props> = ({ post, onClose, onSuccess }) => {
  const [title, setTitle] = useState(post.title || '');
  const [price, setPrice] = useState(post.price.toString());
  const [status, setStatus] = useState(post.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setError('');

    try {
      const updateData = {
        title: title.trim(),
        price: parseFloat(price) || 0,
        status
      };

      const response = await API.put(`/instagram-posts/${post.id}`, updateData);
      
      if (response.data.success) {
        onSuccess(response.data.post);
      } else {
        setError(response.data.message || 'Có lỗi xảy ra');
      }
    } catch (err: any) {
      setError('Không thể cập nhật bài viết. Vui lòng thử lại.');
      console.error('Error updating Instagram post:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (value: string) => {
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, '');
    return numericValue;
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPrice = formatPrice(e.target.value);
    setPrice(formattedPrice);
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <FaInstagram className="text-pink-500" />
            Chỉnh sửa bài viết
          </h3>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle"
            disabled={loading}
          >
            <FaTimes />
          </button>
        </div>

        {/* Preview Section */}
        <div className="mb-6 p-4 bg-base-200 rounded-lg">
          <div className="flex gap-4">
            <div className="avatar">
              <div className="mask mask-squircle w-16 h-16">
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
            <div className="flex-1">
              <div className="font-semibold">@{post.username}</div>
              <div className="text-sm text-gray-500">
                {post.image_count} hình ảnh
              </div>
              <a
                href={post.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="link link-primary text-sm"
              >
                Xem bài gốc
              </a>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Tiêu đề</span>
              </label>
              <input
                type="text"
                placeholder="Nhập tiêu đề cho bài viết"
                className="input input-bordered w-full"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
                maxLength={255}
              />
              <label className="label">
                <span className="label-text-alt text-gray-500">
                  {title.length}/255 ký tự
                </span>
              </label>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Giá bán (VNĐ)</span>
              </label>
              <input
                type="text"
                placeholder="0"
                className="input input-bordered w-full"
                value={price}
                onChange={handlePriceChange}
                disabled={loading}
              />
              <label className="label">
                <span className="label-text-alt text-gray-500">
                  Để trống hoặc 0 nếu chưa định giá
                </span>
              </label>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Trạng thái</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={status}
                onChange={(e) => setStatus(e.target.value as 'active' | 'sold' | 'hidden')}
                disabled={loading}
              >
                <option value="active">Đang bán</option>
                <option value="sold">Đã bán</option>
                <option value="hidden">Ẩn bài viết</option>
              </select>
            </div>

            {/* Caption Preview */}
            {post.caption && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Caption gốc</span>
                </label>
                <textarea
                  className="textarea textarea-bordered"
                  value={post.caption}
                  readOnly
                  rows={3}
                />
              </div>
            )}
          </div>

          {error && (
            <div className="alert alert-error mt-4">
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="modal-action">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Đang lưu...
                </>
              ) : (
                <>
                  <FaSave />
                  Lưu thay đổi
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditInstagramPostModal;
