import IMask from "imask";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".request_form");
  if (!form) return;

  const element = document.getElementById("phone");
  const maskOptions = {
    // Базовый номер + опциональное продолжение (доп. номер и т.п.)
    mask: "+{7}(000)000-00-00[ 0000000]",
    lazy: false, // Маска применяется сразу, а не по фокусу
    placeholderChar: "_", // Символ плейсхолдера внутри маски
    definitions: {
      // Можно определить свои символы (0 - цифры)
      0: /[0-9]/,
    },
  };
  IMask(element, maskOptions);

  const fields = {
    name: form.querySelector("#name"),
    email: form.querySelector("#email"),
    phone: form.querySelector("#phone"),
    text: form.querySelector("#text"),
    consent: form.querySelector("#consent"),
  };

  const msgs = {
    required: "Это поле обязательно",
    name: "Введите корректное имя",
    email: "Проверьте формат email",
    phone: "Проверьте количество цифр в номере телефона",
    text: "Описание проблемы слишком короткое. Минимальная длина — 50 символов.",
    consent: "Необходимо согласие на обработку данных",
  };

  function getErrorEl(el) {
    const container = el.closest(".form_conteiner");
    if (!container) return null;
    return container.querySelector(".form_error");
  }

  function showError(el, message) {
    const err = getErrorEl(el);
    if (!err) return;
    err.textContent = message;
    err.classList.add("show");
    err.setAttribute("role", "alert");
    err.setAttribute("aria-live", "polite");
    el.setAttribute("aria-invalid", "true");
    if (err.id) {
      el.setAttribute("aria-describedby", err.id);
    }
  }

  function clearError(el) {
    const err = getErrorEl(el);
    if (err) {
      err.textContent = "";
      err.classList.remove("show");
      err.removeAttribute("role");
      err.removeAttribute("aria-live");
    }
    el.removeAttribute("aria-invalid");
    el.removeAttribute("aria-describedby");
  }

  function validateName() {
    const v = fields.name.value.trim();
    if (!v) {
      showError(fields.name, msgs.required);
      return false;
    }
    if (v.length < 2) {
      showError(fields.name, msgs.name);
      return false;
    }
    clearError(fields.name);
    return true;
  }

  function validateEmail() {
    const v = fields.email.value.trim();
    if (!v) {
      showError(fields.email, msgs.required);
      return false;
    }
    // simple email regex
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(v)) {
      showError(fields.email, msgs.email);
      return false;
    }
    clearError(fields.email);
    return true;
  }

  function validatePhone() {
    const v = fields.phone.value.trim();
    const digits = v.replace(/\D/g, "");
    const minDigits = 11; // +7 и ещё 10 цифр
    //const maxDigits = 15; // запас на добавочный номер

    if (!digits.length) {
      showError(fields.phone, msgs.required);
      return false;
    }

    if (digits.length < minDigits) {
      showError(fields.phone, `Номер слишком короткий.`);
      return false;
    }

    if (digits.length > minDigits) {
      showError(fields.phone, `Номер слишком длинный.`);
      return false;
    }

    clearError(fields.phone);
    return true;
  }

  function validateText() {
    const v = fields.text.value.trim();
    if (!v) {
      showError(fields.text, msgs.required);
      return false;
    }
    if (v.length < 50) {
      showError(fields.text, msgs.text);
      return false;
    }
    clearError(fields.text);
    return true;
  }

  function validateConsent() {
    if (!fields.consent.checked) {
      showError(fields.consent, msgs.consent);
      return false;
    }
    clearError(fields.consent);
    return true;
  }

  // real-time clearing и отключение стандартного UI валидации браузера
  Object.values(fields).forEach((f) => {
    if (!f) return;
    const ev = f.type === "checkbox" ? "change" : "input";
    f.addEventListener(ev, () => clearError(f));
    // подавляем стандартное всплывающее сообщение браузера
    f.addEventListener("invalid", (e) => e.preventDefault());
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const ok = [
      validateName(),
      validateEmail(),
      validatePhone(),
      validateText(),
      validateConsent(),
    ].every(Boolean);
    // prepare payload
    const payload = {
      name: fields.name.value.trim(),
      email: fields.email.value.trim(),
      phone: fields.phone.value.trim(),
      text: fields.text.value.trim(),
    };

    if (!ok) return;

    const submitBtn = form.querySelector('[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.textContent : null;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Отправка...";
    }

    const overlay = document.querySelector(".modal_overlay");
    let keydownHandler;

    const closeModal = () => {
      if (overlay) {
        overlay.classList.remove("modal_open");
        overlay.setAttribute("aria-hidden", "true");
      }
      if (keydownHandler) {
        document.removeEventListener("keydown", keydownHandler);
        keydownHandler = null;
      }
    };

    const openModal = () => {
      if (overlay) {
        overlay.classList.add("modal_open");
        overlay.setAttribute("aria-hidden", "false");

        // Закрытие по Enter / Escape
        keydownHandler = (event) => {
          if (event.key === "Escape" || event.key === "Enter") {
            event.preventDefault();
            closeModal();
          }
        };
        document.addEventListener("keydown", keydownHandler);
      }
    };

    // allow closing by close button
    if (overlay) {
      const closeBtn = overlay.querySelector(".modal_close-btn");
      const okBtn = overlay.querySelector("#okBtn");
      if (closeBtn) closeBtn.addEventListener("click", closeModal);
      if (okBtn) okBtn.addEventListener("click", closeModal);
      // close when clicking outside modal
      overlay.addEventListener("click", (ev) => {
        if (ev.target === overlay) closeModal();
      });
    }

    // If `data-endpoint` provided on the form — POST JSON there
    const endpoint = form.dataset.endpoint;
    const toEmail = form.dataset.to; // fallback: mailto recipient

    (async () => {
      try {
        if (endpoint) {
          const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error("Network response was not ok");
          form.reset();
          openModal();
        } else if (toEmail) {
          // mailto fallback — opens user's mail client
          const subject = encodeURIComponent("Заявка с сайта");
          const body = encodeURIComponent(
            `Имя: ${payload.name}\nEmail: ${payload.email}\nТелефон: ${payload.phone}\n\n${payload.text}`,
          );
          window.location.href = `mailto:${toEmail}?subject=${subject}&body=${body}`;
          // still show modal as confirmation
          form.reset();
          openModal();
        } else {
          // No endpoint configured — just show modal as local confirmation
          form.reset();
          openModal();
        }
      } catch (err) {
        console.error("Submit error", err);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          if (originalBtnText) submitBtn.textContent = originalBtnText;
        }
      }
    })();
  });
});
