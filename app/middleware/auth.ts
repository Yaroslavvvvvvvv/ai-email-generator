export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()
  if (user.value) return

  const localePath = useLocalePath()
  return navigateTo({
    path: localePath('/login'),
    query: { redirect: to.fullPath },
  })
})
