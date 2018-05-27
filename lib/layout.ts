import m from 'mithril'
import {Vnode} from 'mithril'

type Content = Vnode<any,any> | Vnode<any,any>[]

export default function layout (selector: string, sidebar: Content, content: Content) {
  return m(selector, [
    m('div', // flexbox needs this
      m('header.navbar.px-2.py-1',
        m('section.navbar-section',
          m('a[href=/].navbar-brand.mr-2', link, 'KeyDash', m('small', ' (for OS X)')),
          // m('a[href=#].btn.btn-link', 'My Stats'),
        ),
        m('section.navbar-section',
          m('a[href=/].btn.btn-link', link, 'Home'),
          m('a[href=/tips].btn.btn-link', link, 'Pro Tips'),
          m('a[href=https://github.com/gilbert/keydash].btn.btn-link', 'Source'),
        )
      ),
    ),

    m('.flex.d-flex',
      m('.sidebar.scroll.px-2', { style: { maxWidth: '33%', minWidth: '10rem' } }, sidebar),
      m('main.flex.py-1', content)
    )
  ])
}

// HACK: Use same mithril instance from base page (when available)
const m2 = (window as any).m
const link = {oncreate: (m2 ? m2 : m).route.link}
