import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BaseballCommunityPost = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPost, setNewPost] = useState({
    user_id: '',
    baseball_community_id: '',
    title: '',
    content: '',
    image_url: ''
  });
  const [editingPost, setEditingPost] = useState(null);
  const [likedPosts, setLikedPosts] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/post/your-api-key');
        setPosts(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost({ ...newPost, [name]: value });
  };

  const handleCreatePost = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/post/6VVQ0SB-C3X4PJQ-J3DZ587-5FGKYD1', newPost);
      setPosts([...posts, response.data]);
      setNewPost({
        user_id: '',
        baseball_community_id: '',
        title: '',
        content: '',
        image_url: ''
      });
    } catch (error) {
      console.error('게시물 생성 중 오류 발생:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`http://localhost:4000/api/post/6VVQ0SB-C3X4PJQ-J3DZ587-5FGKYD1/${postId}`);
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('게시물 삭제 중 오류 발생:', error);
    }
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setNewPost({
      user_id: post.user_id,
      baseball_community_id: post.baseball_community_id,
      title: post.title,
      content: post.content,
      image_url: post.image_url
    });
  };

  const handleUpdatePost = async () => {
    try {
      const response = await axios.put(`http://localhost:4000/api/post/6VVQ0SB-C3X4PJQ-J3DZ587-5FGKYD1/${editingPost.id}`, newPost);
      setPosts(posts.map(post => post.id === editingPost.id ? response.data : post));
      setEditingPost(null);
      setNewPost({
        user_id: '',
        baseball_community_id: '',
        title: '',
        content: '',
        image_url: ''
      });
    } catch (error) {
      console.error('게시물 수정 중 오류 발생:', error);
    }
  };

  const handleLikePost = async (postId) => {
    const isLiked = likedPosts[postId];
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          like_num: isLiked ? post.like_num - 1 : post.like_num + 1
        };
      }
      return post;
    });

    setPosts(updatedPosts);
    setLikedPosts({ ...likedPosts, [postId]: !isLiked });

    try {
      await axios.put(`http://localhost:4000/api/post/6VVQ0SB-C3X4PJQ-J3DZ587-5FGKYD1/${postId}`, {
        like_num: isLiked ? updatedPosts.find(post => post.id === postId).like_num - 1 : updatedPosts.find(post => post.id === postId).like_num + 1
      });
    } catch (error) {
      console.error('좋아요 업데이트 중 오류 발생:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Baseball Community Posts</h1>
      <div>
        <h2>{editingPost ? 'Edit Post' : 'Create New Post'}</h2>
        <input
          type="text"
          name="user_id"
          placeholder="User ID"
          value={newPost.user_id}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="baseball_community_id"
          placeholder="Community ID"
          value={newPost.baseball_community_id}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={newPost.title}
          onChange={handleInputChange}
        />
        <textarea
          name="content"
          placeholder="Content"
          value={newPost.content}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="image_url"
          placeholder="Image URL"
          value={newPost.image_url}
          onChange={handleInputChange}
        />
        {editingPost ? (
          <button onClick={handleUpdatePost}>Update Post</button>
        ) : (
          <button onClick={handleCreatePost}>Create Post</button>
        )}
      </div>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <p>Likes: {post.like_num}</p>
            <p>Comments: {post.comments_num}</p>
            <button onClick={() => handleEditPost(post)}>Edit</button>
            <button onClick={() => handleDeletePost(post.id)}>Delete</button>
            <button onClick={() => handleLikePost(post.id)}>
              {likedPosts[post.id] ? 'Unlike' : 'Like'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BaseballCommunityPost;
