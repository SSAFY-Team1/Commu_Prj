const KEY = 'localhub_posts'

export function getPosts() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch (e) {
    return []
  }
}

export function savePost(post) {
  const posts = getPosts()
  posts.unshift(post)
  localStorage.setItem(KEY, JSON.stringify(posts))
}

export function updatePost(id, changes) {
  const posts = getPosts()
  const i = posts.findIndex(p => p.id === id)
  if (i >= 0) {
    posts[i] = { ...posts[i], ...changes }
    localStorage.setItem(KEY, JSON.stringify(posts))
  }
}

export function deletePost(id) {
  const posts = getPosts().filter(p => p.id !== id)
  localStorage.setItem(KEY, JSON.stringify(posts))
}
