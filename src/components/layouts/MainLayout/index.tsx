import React from 'react'

function MainLayout ({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <main>
      <header></header>
      <section>{children}</section>
      <footer></footer>
    </main>
  )
}

export default MainLayout
