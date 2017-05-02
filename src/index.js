import m from 'mithril';
import './styles.css';

// This is needed for hot-module-replacement
if (module.hot) {
  module.hot.accept();
}

const root = document.getElementById('root');

const QuoteModel = {
  getQuote: function () {
    return m.request({
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Mashape-Key": "OivH71yd3tmshl9YKzFH7BTzBVRQp1RaKLajsnafgL2aPsfP9V"
      },
      url: "https://andruxnet-random-famous-quotes.p.mashape.com/cat=",
      withCredentials: true,
    })
      .then(function (result) {
        QuoteModel.currentQuote = result.quote;
        QuoteModel.currentAuthor = result.author
      })
  },
  currentQuote: '',
  currentAuthor: ''
};

const state = {
  model: QuoteModel
};

let MainApp = ({
  view: () => {
    return m("section", {
      class: "section is-overlay main"
    }, [m(TitleComponent), m(QuoteComponent), m(TwitterButton)])
  }
});

let TitleComponent = ({
  view: () => {
    return m("div", {
      class: "column is-half is-offset-one-quarter quote-container box content top-margin"
    }, [m("h1", {
      class: "has-text-centered is-marginless"
    }, "Random Quote Generator")])
  }
});

let QuoteComponent = ({
  view: () => {
    return m("div", {
      class: "column is-half is-offset-one-quarter quote-container box content relative-pos"
    }, [m("a", {
      class: "stick-top-right", title: "Get new Quote", style: "position: absolute;right: 2px;top: 2px;",
      onclick: QuoteModel.getQuote
    }, m(IconButton, {icon: "random"})), m(QuoteSection)])
  }
});

let QuoteSection = ({
  oninit: QuoteModel.getQuote,
  view: () => {
    return m("section", {class: "is-bold"}, [
      m("div", {class: "hero-body has-text-centered"}, [
        m("h1", {class: "title font-default"}, state.model.currentQuote),
        m("h3", {class: "subtitle"}, state.model.currentAuthor ? '--   ' + state.model.currentAuthor : 'Loading quote...'),
      ])]);
  }
});

let TwitterButton = ({
  view: () => {
    return m("div", {class: "column"}, [
      m("p", {class: "field has-text-centered"}, [
        m("a", {
          class: "button is-primary",
          href: `https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=${encodeURIComponent('"' + state.model.currentQuote + '" ' + state.model.currentAuthor)}`
        }, [
          m(IconButton, {icon: "twitter"}),
          m("span", "Tweet")
        ])
      ])
    ])
  }
});


let IconButton = ({
  view: (vnode) => {
    return m('span', {class: 'icon'}, [m('i', {class: `fa fa-${vnode.attrs.icon}`})])
  }
});

m.mount(root, MainApp);