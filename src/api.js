/* global reactPress */
import WPAPI from 'wpapi'

// CRITICAL: This line is required for WPAPI to work with Vite
window.global = window

const wp = new WPAPI(
  !import.meta.env.PROD
    ? {
        endpoint: reactPress.api.rest_url,
        username: 'admin',
        password: 'YOUR_APP_PASSWORD_HERE', // Replace with your actual app password
      }
    : { endpoint: reactPress.api.rest_url, nonce: reactPress.api.nonce }
)

export async function getContacts(q = '') {
  try {
    const users = await wp.users().search(q)
    return users.filter(user => user.id !== 1) // we don't want the admin user
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function createContact(user) {
  try {
    const result = await wp.users().create(user)
    return result
  } catch (error) {
    console.error(error)
  }
}

export async function getContact(id) {
  try {
    const user = await wp.users().id(id).param('context', 'edit')
    return user
  } catch (error) {
    console.error(error)
    return {}
  }
}

export async function updateContact(id, user) {
  try {
    const result = await wp.users().id(id).update({
      ...user, 
      name: `${user.first_name} ${user.last_name}`
    })
    return result
  } catch (error) {
    console.error(error)
  }
}

export async function deleteContact(id) {
  try {
    const result = await wp.users().id(id).delete({ force: true, reassign: 0 })
    return result
  } catch (error) {
    console.error(error)
  }
}