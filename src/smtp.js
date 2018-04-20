/* SmtpJS.com - v2.0.1 */
function send(e, o, t, n, a, s, r, c) { 
	var d = Math.floor(1e6 * Math.random() + 1), i = "From=" + e; i += "&to=" + o, i += "&Subject=" + encodeURIComponent(t), i += "&Body=" + encodeURIComponent(n), void 0 == a.token ? (i += "&Host=" + a, i += "&Username=" + s, i += "&Password=" + r, i += "&Action=Send") : (i += "&SecureToken=" + a.token, i += "&Action=SendFromStored", c = a.callback), i += "&cachebuster=" + d, ajaxPost("https://smtpjs.com/v2/smtp.aspx?", i, c) 
} 

function sendWithAttachment(e, o, t, n, a, s, r, c, d) { var i = Math.floor(1e6 * Math.random() + 1), m = "From=" + e; m += "&to=" + o, m += "&Subject=" + encodeURIComponent(t), m += "&Body=" + encodeURIComponent(n), m += "&Attachment=" + encodeURIComponent(c), void 0 == a.token ? (m += "&Host=" + a, m += "&Username=" + s, m += "&Password=" + r, m += "&Action=Send") : (m += "&SecureToken=" + a.token, m += "&Action=SendFromStored"), m += "&cachebuster=" + i, ajaxPost("https://smtpjs.com/v2/smtp.aspx?", m, d) 
}

function ajaxPost(e, o, t) { var n = createCORSRequest("POST", e); n.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), n.onload = function () { var e = n.responseText; void 0 != t && t(e) }, n.send(o) 
}

function ajax(e, o) { var t = createCORSRequest("GET", e); t.onload = function () { var e = t.responseText; void 0 != o && o(e) }, t.send() 
}

function createCORSRequest(e, o) { var t = new XMLHttpRequest; return "withCredentials" in t ? t.open(e, o, !0) : "undefined" != typeof XDomainRequest ? (t = new XDomainRequest).open(e, o) : t = null, t 
}


export {send, sendWithAttachment, ajaxPost, ajax, createCORSRequest};