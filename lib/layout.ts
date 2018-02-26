import m from 'mithril'
import {Vnode} from 'mithril'

type Content = Vnode<any,any> | Vnode<any,any>[]

export default function layout (sidebar: Content, content: Content) {
  return [
    m('div',
      m('header.navbar.px-2.py-1',
        m('section.navbar-section',
          m('a[href=/].navbar-brand.mr-2', 'KeyDash'),
          // m('a[href=/].btn.btn-link', 'Levels'),
          // m('a[href=#].btn.btn-link', 'My Stats'),
        ),
      ),
    ),

    m('.flex.d-flex',
      m('.sidebar.scroll', { style: { maxWidth: '33%', minWidth: '10rem' } }, sidebar),
      m('main.flex', content)
    )
  ]
}
