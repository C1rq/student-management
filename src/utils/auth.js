const TOKEN_KEY = "ssm-token";
const USER_KEY = "ssm-user"

export function getToken() {
    return localStorage.getItem(TOKEN_KEY)
}
export function setToken(token) {
    return localStorage.setItem(TOKEN_KEY, token)
}
export function getUser() {
    return JSON.parse(localStorage.getItem(USER_KEY))
}
export function settUser(user) {
    return localStorage.setItem(USER_KEY, JSON.stringify(user))
}
export function removeToken() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)

}