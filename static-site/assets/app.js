/* Vizogen static site runtime — plain JS, no framework.
 * Restores: scroll reveals, nav dropdown + mobile menu, pricing toggles,
 * demo popup / scheduler / partner form (WhatsApp + email delivery),
 * chat launcher, rotating hero headline, native selects. */
(function () {
  "use strict";

  var WHATSAPP = "918488918358";
  var EMAIL = "info.vizogen@gmail.com";

  var GUIDE_LINKS = [
    { label: "How To Connect GBP", href: "/how-to-connect-gbp" },
    { label: "Create AI Post", href: "/how-to-create-post" },
    { label: "Reply to Reviews", href: "/how-to-reply-review" },
    { label: "Generate Magic QR", href: "/how-to-generate-magic-qr" },
    { label: "Post on GBP", href: "/how-to-post-on-gbp" },
  ];
  var NAV_LINKS = [
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/#pricing" },
    { label: "How it works", href: "/#how-it-works" },
    { label: "Reviews", href: "/#reviews" },
    { label: "FAQ", href: "/#faq" },
    { label: "Partner", href: "/partner" },
  ];
  var INDUSTRIES = [
    "Gym & Fitness",
    "Clinic & Healthcare",
    "Restaurant & Cafe",
    "Salon & Spa",
    "Bakery",
    "Real Estate",
    "Education & Coaching",
    "Pest Control",
    "Car Garage",
    "Travel & Tourism",
    "Yoga & Wellness",
    "Handyman & Services",
    "Other",
  ];

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }
  function $$(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  /* ---------- scroll reveals ---------- */
  function reveals() {
    var targets = $$("section > div, section");
    if (!("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("vz-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    targets.forEach(function (t) {
      if (t.dataset.vzRevealed) return;
      t.dataset.vzRevealed = "1";
      io.observe(t);
    });
  }

  /* ---------- navbar ---------- */
  function navbar() {
    var header = $("header");
    if (!header) return;

    window.addEventListener(
      "scroll",
      function () {
        var on = window.scrollY > 8;
        header.classList.toggle("border-b", on);
        header.classList.toggle("shadow-soft", on);
      },
      { passive: true },
    );

    // GBP Guide dropdown
    var guideBtn = $$("button", header).filter(function (b) {
      return /GBP Guide/.test(b.textContent || "");
    })[0];
    if (guideBtn && guideBtn.parentElement) {
      var panel = el(
        "div",
        "vz-hidden absolute left-0 top-full z-50 mt-3 w-[350px] rounded-2xl border border-border bg-card p-5 shadow-xl",
        '<p class="px-2 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">GMB Mastery Guide</p>' +
          '<div class="mt-4 space-y-1.5">' +
          GUIDE_LINKS.map(function (g) {
            return (
              '<a href="' +
              g.href +
              '" class="block rounded-xl px-2.5 py-2.5 text-[15px] font-semibold text-foreground transition-colors hover:bg-brand/5">' +
              g.label +
              "</a>"
            );
          }).join("") +
          "</div>" +
          '<div class="mt-4 border-t border-border pt-4"><a href="/blog" class="block rounded-xl px-2.5 py-2 text-lg font-bold text-foreground hover:bg-accent">Blog</a></div>',
      );
      var wrap = guideBtn.parentElement;
      wrap.classList.add("relative");
      wrap.appendChild(panel);
      var timer;
      var show = function () {
        clearTimeout(timer);
        panel.classList.remove("vz-hidden");
      };
      var hide = function () {
        timer = setTimeout(function () {
          panel.classList.add("vz-hidden");
        }, 160);
      };
      wrap.addEventListener("mouseenter", show);
      wrap.addEventListener("mouseleave", hide);
      guideBtn.addEventListener("click", function (e) {
        e.preventDefault();
        panel.classList.toggle("vz-hidden");
      });
    }

    // Mobile menu
    var burger = $('button[aria-label="Toggle menu"]', header);
    if (burger) {
      var mobile = el(
        "div",
        "vz-hidden border-t border-border bg-background px-4 pb-5 pt-3 xl:hidden",
        '<div class="flex flex-col">' +
          NAV_LINKS.map(function (l) {
            return (
              '<a href="' +
              l.href +
              '" class="rounded-lg px-2 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground">' +
              l.label +
              "</a>"
            );
          }).join("") +
          '<p class="px-2 pb-1 pt-3 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">GMB Mastery Guide</p>' +
          GUIDE_LINKS.map(function (g) {
            return (
              '<a href="' +
              g.href +
              '" class="rounded-lg px-2 py-2.5 text-sm font-semibold text-foreground hover:bg-accent">' +
              g.label +
              "</a>"
            );
          }).join("") +
          '<a href="/blog" class="rounded-lg px-2 py-2.5 text-sm font-semibold text-foreground hover:bg-accent">Blog</a>' +
          '<div class="mt-4 grid gap-2">' +
          '<a href="/login" class="rounded-full border border-border px-4 py-2.5 text-center text-sm font-semibold text-foreground">Login</a>' +
          '<a href="/demo" class="rounded-full gradient-brand px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground">Start Free Demo →</a>' +
          '<a href="tel:+918488918358" class="px-2 py-1 text-center text-sm text-muted-foreground">+91 84889 18358</a>' +
          "</div></div>",
      );
      header.appendChild(mobile);
      burger.addEventListener("click", function () {
        mobile.classList.toggle("vz-hidden");
      });
    }
  }

  /* ---------- pricing toggles ---------- */
  function pricing() {
    $$("[data-pricing]").forEach(function (section) {
      var state = { cycle: "yearly", currency: "INR" };
      function paint() {
        $$("[data-toggle-group]", section).forEach(function (group) {
          var key = group.getAttribute("data-toggle-group");
          $$("[data-toggle-value]", group).forEach(function (btn) {
            var active = btn.getAttribute("data-toggle-value") === state[key];
            btn.setAttribute("aria-pressed", String(active));
            btn.classList.toggle("gradient-brand", active);
            btn.classList.toggle("text-primary-foreground", active);
            btn.classList.toggle("shadow-soft", active);
            btn.classList.toggle("text-muted-foreground", !active);
          });
        });
        $$("[data-price-inr-yearly]", section).forEach(function (node) {
          node.textContent = node.getAttribute(
            "data-price-" + state.currency.toLowerCase() + "-" + state.cycle,
          );
        });
        $$("[data-period]", section).forEach(function (node) {
          node.textContent = state.cycle === "yearly" ? "/year" : "/quarter";
        });
      }
      $$("[data-toggle-group] [data-toggle-value]", section).forEach(function (btn) {
        btn.addEventListener("click", function () {
          var key = btn.parentElement.getAttribute("data-toggle-group");
          state[key] = btn.getAttribute("data-toggle-value");
          paint();
        });
      });
      paint();
    });
  }

  /* ---------- native selects (replace non-functional custom triggers) ---------- */
  function selects() {
    $$('[role="combobox"]').forEach(function (trigger) {
      var select = el(
        "select",
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground",
      );
      var name = (trigger.getAttribute("aria-label") || trigger.textContent || "field").trim();
      select.name = name.toLowerCase().replace(/[^a-z]+/g, "-");
      select.required = true;
      var placeholder = el("option", null, name);
      placeholder.value = "";
      select.appendChild(placeholder);
      INDUSTRIES.forEach(function (i) {
        var o = el("option", null, i);
        o.value = i;
        select.appendChild(o);
      });
      trigger.parentElement.replaceChild(select, trigger);
    });
  }

  /* ---------- lead forms → WhatsApp + email ---------- */
  function formPayload(form) {
    var lines = [];
    $$("input, select, textarea", form).forEach(function (field) {
      if (!field.value || field.type === "submit" || field.type === "hidden") return;
      var label = "";
      if (field.id) {
        var lab = document.querySelector('label[for="' + field.id + '"]');
        if (lab) label = lab.textContent.trim();
      }
      if (!label) label = field.getAttribute("placeholder") || field.name || "Field";
      lines.push(label.replace(/\*$/, "").trim() + ": " + field.value.trim());
    });
    return lines;
  }

  function sendLead(form, subject) {
    var lines = formPayload(form);
    if (!lines.length) return false;
    var text = subject + "\n\n" + lines.join("\n");
    window.open("https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(text), "_blank");
    window.location.href =
      "mailto:" +
      EMAIL +
      "?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(text);
    return true;
  }

  function successCard(subject) {
    return (
      '<div class="rounded-2xl border border-border bg-card p-8 text-center shadow-soft">' +
      '<div class="mx-auto grid size-14 place-items-center rounded-full gradient-brand text-2xl text-primary-foreground">✓</div>' +
      '<h3 class="mt-4 font-display text-xl font-bold text-foreground">Request ready to send</h3>' +
      '<p class="mt-2 text-sm text-muted-foreground">We opened WhatsApp and your email app with your details. Send the message and our team will reply within a few hours.</p>' +
      '<a href="https://wa.me/' +
      WHATSAPP +
      '?text=' +
      encodeURIComponent(subject) +
      '" target="_blank" rel="noopener" class="mt-5 inline-flex rounded-full gradient-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground">Open WhatsApp again</a>' +
      "</div>"
    );
  }

  function forms() {
    $$("form").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var subject = (document.title.split("—")[0] || "Vizogen").trim() + " enquiry";
        if (sendLead(form, subject)) {
          var holder = el("div", "mt-6", successCard(subject));
          form.replaceWith(holder);
        }
      });
    });
  }

  /* ---------- demo modal (triggered by non-link CTAs) ---------- */
  function demoModal() {
    var overlay = null;
    function open() {
      if (overlay) return;
      overlay = el("div", "vz-overlay");
      overlay.innerHTML =
        '<div class="w-full max-w-[520px] rounded-2xl border border-border bg-card p-6 shadow-lift sm:p-8">' +
        '<div class="flex items-start justify-between gap-4">' +
        '<div><h3 class="font-display text-xl font-bold text-foreground">Book your free demo</h3>' +
        '<p class="mt-1 text-sm text-muted-foreground">Share your details and we\'ll set up a 30-minute walkthrough.</p></div>' +
        '<button type="button" data-close class="grid size-9 place-items-center rounded-full border border-border text-muted-foreground">✕</button></div>' +
        '<form class="mt-5 grid gap-3">' +
        ['Full name', 'Business name', 'Phone number', 'Email address', 'City']
          .map(function (p) {
            return (
              '<input required placeholder="' +
              p +
              '" class="h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm text-foreground outline-none focus:border-brand">'
            );
          })
          .join("") +
        '<select required class="h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm text-foreground"><option value="">Industry</option>' +
        INDUSTRIES.map(function (i) {
          return '<option value="' + i + '">' + i + "</option>";
        }).join("") +
        "</select>" +
        '<textarea rows="3" placeholder="Anything we should know? (optional)" class="w-full rounded-xl border border-input bg-background p-3.5 text-sm text-foreground"></textarea>' +
        '<button type="submit" class="mt-1 h-11 w-full rounded-full gradient-brand text-sm font-semibold text-primary-foreground">Book My Demo →</button>' +
        '<p class="text-center text-[11px] text-muted-foreground">Or call +91 84889 18358</p>' +
        "</form></div>";
      document.body.appendChild(overlay);
      document.body.style.overflow = "hidden";
      $$("[data-vz-widget]").forEach(function (w) {
        w.classList.add("vz-hidden");
      });
      overlay.addEventListener("click", function (e) {
        if (e.target === overlay || e.target.hasAttribute("data-close")) close();
      });
      var form = $("form", overlay);
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (sendLead(form, "New Vizogen demo request")) {
          $("div", overlay).innerHTML = successCard("Hi Vizogen, I just booked a demo.");
        }
      });
    }
    function close() {
      if (!overlay) return;
      overlay.remove();
      overlay = null;
      document.body.style.overflow = "";
      $$("[data-vz-widget]").forEach(function (w) {
        w.classList.remove("vz-hidden");
      });
    }
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
    window.vizogenOpenDemo = open;

    // Buttons that used React handlers: match by label.
    $$("button").forEach(function (btn) {
      var t = (btn.textContent || "").toLowerCase();
      if (/demo|book|apply|become a partner|get started/.test(t) && !btn.closest("form")) {
        btn.addEventListener("click", function (e) {
          e.preventDefault();
          open();
        });
      }
    });

    // Auto popup once per session on the homepage.
    if (document.body.dataset.path === "/" && !sessionStorage.getItem("vzDemoPopup")) {
      setTimeout(function () {
        sessionStorage.setItem("vzDemoPopup", "1");
        open();
      }, 4500);
    }
  }

  /* ---------- floating widgets / chat ---------- */
  function widgets() {
    var fixed = $$('div[class*="fixed"][class*="bottom-6"]');
    fixed.forEach(function (f) {
      f.setAttribute("data-vz-widget", "");
    });
    // Chat launcher → WhatsApp-backed panel.
    $$("[data-vz-widget] button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        window.open(
          "https://wa.me/" +
            WHATSAPP +
            "?text=" +
            encodeURIComponent("Hi Vizogen, I have a question about your plans."),
          "_blank",
        );
      });
    });
  }

  /* ---------- rotating hero headline ---------- */
  function rotator() {
    var node = $("[data-rotate]") || $("h1 .text-gradient");
    if (!node) return;
    var words = ["Google Business Profile", "Local Rankings", "Customer Reviews", "Daily Posts"];
    var i = 0;
    setInterval(function () {
      i = (i + 1) % words.length;
      node.style.opacity = "0";
      setTimeout(function () {
        node.textContent = words[i];
        node.style.opacity = "1";
      }, 220);
    }, 2600);
    node.style.transition = "opacity .22s ease";
  }

  function init() {
    reveals();
    navbar();
    pricing();
    selects();
    forms();
    demoModal();
    widgets();
    rotator();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
