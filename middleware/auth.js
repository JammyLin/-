export default function({ store, redirect }) {
  if (JSON.stringify(store.state.user) === '{}') {
    return redirect('/auth/login')
  }
}
