import iframeMessenger from 'guardian/iframe-messenger'
import reqwest from 'reqwest'
import { Birds } from './modules/birds'

window.init = function init(el, config) {

    iframeMessenger.enableAutoResize();

    reqwest({
        url: 'https://interactive.guim.co.uk/docsdata/1_nYwqsp_xnXZ7mL0FzkrWbq894-z-0mR7U34RDd4u6s.json',
        type: 'json',
        crossOrigin: true,
        success: (resp) => {
            let birds = new Birds(el, resp)
        }
    });

};
