import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import axios from 'axios'

const store = createStore({
  state() {
    return {
      user: null,
      posts: [],
      comments: {},
      followers: {},
    }
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    },
    clearUser(state) {
      state.user = null
    },
    setPosts(state, posts) {
      state.posts = posts
    },
    addPost(state, post) {
      state.posts.push(post)
    },
    updatePost(state, updatedPost) {
      const index = state.posts.findIndex((p) => p.id === updatedPost.id)
      if (index !== -1) state.posts[index] = updatedPost
    },
    deletePost(state, postId) {
      state.posts = state.posts.filter((post) => post.id !== postId)
    },
    // for comments
    setComments(state, { postId, comments }) {
      state.comments[postId] = comments
    },
    addComment(state, { postId, comment }) {
      if (!state.comments[postId]) {
        state.comments[postId] = []
      }
      state.comments[postId].push(comment)
    },
    // nie aktualizuje sie lokalny stan komentarzy(fetchComments)
    updateComment(state, { postId, updatedComment }) {
      const index = state.comments[postId].findIndex((comment) => comment.id === updatedComment.id)
      if (index !== -1) {
        state.comments[postId].splice(index, 1, updatedComment)
      }
    },
    deleteComment(state, { postId, commentId }) {
      state.comments[postId] = state.comments[postId].filter((comment) => comment.id !== commentId)
    },
    // follow and unfollow logic
    follow(state, { followerId, followedId }) {
      if (!state.followers[followedId]) {
        state.followers[followedId] = []
      }
      state.followers[followedId].push(followerId)
      // console.log(state.followers[followedId])
    },
    unfollow(state, { followerId, followedId }) {
      if (state.followers[followedId]) {
        state.followers[followedId] = state.followers[followedId].filter((id) => id !== followerId)
      }
    },
    setFollowers(state, { userId, followers }) {
      state.followers[userId] = followers
    },
  },
  actions: {
    login({ commit }, user) {
      commit('setUser', user)
    },
    logout({ commit }) {
      commit('clearUser')
    },
    async fetchPosts({ commit }) {
      const response = await axios.get('http://localhost:3000/posts')
      commit('setPosts', response.data)
    },
    async createPost({ commit }, postData) {
      const response = await axios.post('http://localhost:3000/posts', postData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      commit('addPost', response.data)
    },
    async editPost({ commit }, { postId, postData }) {
      try {
        const response = await axios.put(`http://localhost:3000/posts/${postId}`, postData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        commit('updatePost', response.data)
      } catch (error) {
        console.error('Błąd podczas edycji posta:', error)
        throw error
      }
    },
    async removePost({ commit }, postId) {
      await axios.delete(`http://localhost:3000/posts/${postId}`)
      commit('deletePost', postId)
    },
    async fetchComments({ commit }, postId) {
      // console.log(postId)
      try {
        const response = await axios.get(`http://localhost:3000/comments/posts/${postId}`)
        commit('setComments', { postId, comments: response.data })
      } catch (error) {
        console.error('Błąd podczas pobierania komentarzy:', error)
      }
    },
    async addComment({ commit }, { postId, comment }) {
      try {
        const response = await axios.post(`http://localhost:3000/comments/posts/${postId}`, comment)
        commit('addComment', { postId, comment: response.data })
      } catch (error) {
        console.error('Błąd podczas dodawania komentarza:', error)
      }
    },
    async updateComment({ commit, dispatch }, { postId, commentId, content }) {
      // console.log(postId, commentId, content)
      try {
        const response = await axios.put(`http://localhost:3000/comments/${commentId}`, { content })
        await dispatch('fetchComments', postId)
        commit('updateComment', { postId, commentId, updatedComment: response.data })
      } catch (error) {
        console.error('Błąd podczas edycji komentarza:', error)
      }
    },
    async deleteComment({ commit }, { postId, commentId }) {
      try {
        await axios.delete(`http://localhost:3000/comments/${commentId}`)
        commit('deleteComment', { postId, commentId })
      } catch (error) {
        console.error('Błąd podczas usuwania komentarza:', error)
      }
    },
    // follow
    async follow({ commit }, { followerId, followedId }) {
      try {
        const response = await axios.post(`http://localhost:3000/followers/follow`, {
          followerId,
          followedId,
        })
        commit('follow', { followerId, followedId })
      } catch (error) {
        console.error('Błąd podczas obserwowania użytkownika:', error)
      }
    },
    async unfollow({ commit }, { followerId, followedId }) {
      console.log(followerId, followedId)
      try {
        const response = await axios.post(`http://localhost:3000/followers/unfollow`, {
          followerId,
          followedId,
        })
        commit('unfollow', { followerId, followedId })
      } catch (error) {
        console.error('Błąd podczas przestania obserwować użytkownika:', error)
      }
    },
    async fetchFollowers({ commit }, userId) {
      try {
        const response = await axios.get(`http://localhost:3000/followers/followers/${userId}`)
        const followers = response.data.map((follower) => ({
          id: follower.id,
          username: follower.username,
        }))

        commit('setFollowers', { userId, followers })
      } catch (error) {
        console.error('Błąd podczas pobierania followersów:', error)
      }
    },
  },
  getters: {
    isAuthenticated(state) {
      return state.user !== null
    },
    getUser(state) {
      return state.user
    },
    isAuthenticated(state) {
      return state.user !== null
    },
    getUser(state) {
      return state.user
    },
    getPosts(state) {
      return state.posts
    },
    getComments: (state) => (postId) => {
      const comments = state.comments[postId] || []
      return comments.sort((a, b) => a.id - b.id)
    },
    getFollowers: (state) => (userId) => {
      return state.followers[userId] || []
    },
  },
  plugins: [
    createPersistedState({
      storage: window.localStorage,
    }),
  ],
})

export default store
