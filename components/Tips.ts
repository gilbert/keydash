import m from 'mithril'
import layout from '../lib/layout'


type Attrs = {
  key?: Page
}

type Page = 'overview' | 'setup'

const Tips: m.FactoryComponent<Attrs> = ({attrs}) => {

  var subpage: Page = attrs.key || 'overview'

  return {
    view() {
      return layout(''
        m('ul.nav'
          m('li.nav-item', m('a[href=/tips]', link, "Overview")),
          m('li.nav-item',
            m('a[href=/tips/setup]', link, "Ideal Setup"),
            subpage === 'setup' &&
            m('ul.nav',
              m('li', m('a[href=/tips/setup#remap-ctrl]', "Remap Ctrl")),
              m('li', m('a[href=/tips/setup#missing-shortcuts]', "Missing Shorcuts")),
            )
          ),
        ),
        m('.scroll', { style: { maxWidth: '28rem' } }, pages[subpage])
      )
    }
  }
}

export default Tips

const link = {oncreate: m.route.link}

const keydict =
`{
  "~f"="moveWordForward:";
  "~b"="moveWordBackward:";
  "~<"="moveToBeginningOfDocument:";
  "~>"="moveToEndOfDocument:";
  "~v"="pageUp:";
  "~d"="deleteWordForward:";
  "~^h"="deleteWordBackward:";
  "~\\010"="deleteWordBackward:"; /* Alt-backspace */
  "~\\177"="deleteWordBackward:"; /* Alt-delete */
}`

const pages = {
  overview: [
    m.trust(`
      <h1>Pro Tips: Overview</h1>
      <p>Keydash is a keyboard shortcut trainer for OS X.
         Most of shortcuts that you learn here are usable across the entire operating system! 🙌</p>

      <p>These shortcuts are technically Emacs shortcuts. However, I don't use emacs and yet I
         use them everywhere – sublime text, notational velocity, the browser, the terminal, etc.
         The best part is they will work in <u><b>any OS X app</b></u>,
         even if the app didn't mean to support them directly.</p>

      <div class="toast mb-4">WARNING: There are a few useful shortcuts missing.
         Visit the <a href="/tips/setup">Ideal Setup</a> page to see how to fix this!</div>


      <h2>Emacs? Yuck!</h2>

      <p>Prefer vim? I am currently
         <a href="https://github.com/gilbert/keydash" target="_blank">accepting pull requests</a> :)
      </p>

      <h2>Instant Playback!</h2>

      <p>After finishing a level you can play back your keystrokes to see where you struggled.
         Eventually you will be able to save, share, and replay them via
         <a href="https://github.com/byod/byod-home">BYOD</a> :)</p>
    `)
  ],

  setup: [
    m.trust(`
      <h1>Ideal Keyboard Shorcut Setup</h1>

      <p>First off, when I say <i>ideal</i> I mean:</p>

      <ul>
        <li><b>Minimal setup</b> – You shouldn't need to put too much work into
            setting up a new machine.</li>
        <li><b>Close to defaults</b> – By sticking as close to defaults as possible,
            you'll be able to use these shortcuts on any other machine.</li>
        <li><b>Ergonomic</b> – Hands are the most valuable part of a programmer's body.
            Using shortcuts should not compromise your fingers or wrists.</li>
      </ul>

      <h3 id="remap-ctrl">Step 1: A Better Control Key</h3>

      <p>On most mac keyboards the <code>ctrl</code> key is placed in a terrible spot;
         you have to scrunch your hand, wrist, <i>and</i> pinky to get to it.
         For obvious reasons, you don't want to be doing this all day.</p>

      <p>Make your <code>ctrl</code> key more ergonomic by swapping it with your CAPS LOCK
         key:</p>

      <ol>
        <li>Go to <b>System Preferences</b></li>
        <li>Click on <b>Keyboard</b></li>
        <li>Click the <b>Modifier Keys</b> button</li>
        <li>Map the <b>Caps Lock (⇪) Key</b> to <b>^ Control</b></li>
      </ol>

      <p>If you want, you can change the old Control key to Caps Lock. I personally don't.</p>


      <h3 id="missing-shortcuts">Step 2: Regain Missing Shortcuts</h3>

      <p>There are a few really useful shortcuts that got left out of OS X's great idea of
         building these things in. For example, you really want to be able to hit
         <code>alt + f</code> to move forward a word to complement your <code>ctrl + f</code>
         to move forward one character.</p>

      <p>Here's what you need to do:</p>

      <ol>
        <li>Create a file named <code>~/Library/KeyBindings/DefaultKeyBinding.dict</code></li>
        <li>Paste the data below into it</li>
        <li>Restart your computer.</li>
      </ol>

      <pre>${keydict}</pre>

      <h3>Step 3: Celebrate!</h3>

      <p>Congratulations! You only have to do this once. You are set up to be a
         text navigation master.</p>
    `)
  ]
}
