import React, { useState } from 'react';
import { FaInstagram, FaTimes, FaSpinner } from 'react-icons/fa';
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
  onClose: () => void;
  onSuccess: (post: InstagramPost) => void;
}

const AddInstagramPostModal: React.FC<Props> = ({ onClose, onSuccess }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateInstagramUrl = (url: string) => {
    const instagramRegex = /^https?:\/\/(?:www\.)?instagram\.com\/(p|reel|tv)\/[A-Za-z0-9_-]+/;
    return instagramRegex.test(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Vui lòng nhập link Instagram');
      return;
    }

    if (!validateInstagramUrl(url)) {
      setError('Link Instagram không hợp lệ. Vui lòng nhập link bài viết, reel hoặc TV.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await API.post('/instagram-posts/crawl', { url });
      
      if (response.data.success) {
        onSuccess(response.data.post);
      } else {
        setError(response.data.message || 'Có lỗi xảy ra');
      }
    } catch (err: any) {
      if (err.response?.status === 422) {
        setError(err.response.data.message || 'Bài viết đã tồn tại');
      } else {
        setError('Không thể lấy thông tin bài viết. Vui lòng thử lại.');
      }
      console.error('Error crawling Instagram post:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    setError('');
    
    // Clear preview if URL is invalid
    if (newUrl && !validateInstagramUrl(newUrl)) {
      setError('Link Instagram không hợp lệ');
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <FaInstagram className="text-pink-500" />
            Thêm bài viết Instagram
          </h3>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle"
            disabled={loading}
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Link Instagram</span>
            </label>
            <input
              type="url"
              placeholder="https://www.instagram.com/p/..."
              className={`input input-bordered w-full ${error ? 'input-error' : ''}`}
              value={url}
              onChange={handleUrlChange}
              disabled={loading}
              required
            />
            <label className="label">
              <span className="label-text-alt text-gray-500">
                Hỗ trợ: bài viết (/p/), reel (/reel/), IGTV (/tv/)
              </span>
            </label>
          </div>

          {error && (
            <div className="alert alert-error mb-4">
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
              disabled={loading || !url || !!error}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Đang lấy thông tin...
                </>
              ) : (
                'Lấy thông tin'
              )}
            </button>
          </div>
        </form>

        {loading && (
          <div className="mt-4 p-4 bg-base-200 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <FaSpinner className="animate-spin" />
              <span>Đang truy cập Instagram và lấy thông tin bài viết...</span>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Quá trình này có thể mất vài giây
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddInstagramPostModal;
