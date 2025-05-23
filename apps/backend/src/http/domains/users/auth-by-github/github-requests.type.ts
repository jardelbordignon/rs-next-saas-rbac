export type GithubOAuthResponse = {
  access_token: string
  token_type: 'bearer'
  scope: string
}

export type GithubUserResponse = {
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  site_admin: boolean
  name: string | null // name is optional in github
  company: string
  blog: string
  location: string
  email: string | null
  hireable: null
  bio: string
  twitter_username: string | null
  notification_email: string
  public_repos: number
  public_gists: number
  followers: number
  following: number
  created_at: string
  updated_at: string
}
