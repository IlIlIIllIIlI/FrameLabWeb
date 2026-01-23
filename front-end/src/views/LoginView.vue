<template>
  <div class="login">
    <form action="/api/auth/login" method="post">
      <div class="username">
        <input name="email" placeholder="Email Adress" type="text" required />
      </div>
      <div class="password">
        <input name="password" placeholder="Password" type="password" required />
      </div>
      <button class="Button" type="submit">Log In</button>
    </form>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .login {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
