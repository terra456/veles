import IMask from "imask";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".request_form");
  if (!form) return;

  // Функция для проверки, заполнено ли поле полностью
  function isFieldFilled(field) {
    if (!field.value.trim()) return false;

    // Для телефона: проверяем, что введены все цифры (без учета маски)
    if (field.id === "phone") {
      const digits = field.value.replace(/\D/g, "");
      return digits.length >= 11; // +7 и 10 цифр
    }

    // Для остальных полей
    return field.value.trim().length > 0;
  }

  // Функция для обновления состояния поля
  function updateFieldState(field) {
    const isFilled = isFieldFilled(field);
    const hasError =
      field.hasAttribute("aria-invalid") && field.getAttribute("aria-invalid") === "true";

    // Всегда сначала удаляем оба класса
    field.classList.remove("has-value", "empty");

    // Затем добавляем нужный класс
    if (isFilled && !hasError) {
      field.classList.add("has-value");
    } else {
      field.classList.add("empty");
    }
  }

  const phoneElement = document.getElementById("phone");
  const maskOptions = {
    // Базовый номер + опциональное продолжение (доп. номер и т.п.)
    mask: "+{7}(000)000-00-00[ 0000000]",
    lazy: false, // Маска применяется сразу, а не по фокусу
    placeholderChar: "_", // Символ плейсхолдера внутри маски
    definitions: {
      // Можно определить свои символы (0 - цифры)
      0: /[0-9]/,
    },
    // События маски
    onComplete: () => {
      updateFieldState(phoneElement);
    },
    onAccept: () => {
      updateFieldState(phoneElement);
    },
    onBlur: () => {
      updateFieldState(phoneElement);
    },
  };
  const phoneMask = IMask(phoneElement, maskOptions);

  const fields = {
    name: form.querySelector("#name"),
    email: form.querySelector("#email"),
    phone: phoneElement,
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
    err.setAttribute("aria-live", "assertive");
    el.setAttribute("aria-invalid", "true");
    el.classList.remove("has-value");

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
    // Обновляем состояние после очистки ошибки
    updateFieldState(el);
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
    const v = fields.phone.value;
    const digits = v.replace(/\D/g, "");

    if (!digits) {
      showError(fields.phone, msgs.required);
      return false;
    }

    if (digits.length < 11) {
      showError(fields.phone, `Введите 10 цифр номера после +7`);
      return false;
    }

    if (digits.length > 11) {
      showError(fields.phone, `Слишком длинный номер`);
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
  Object.values(fields).forEach((field) => {
    if (!field) return;
    const ev = field.type === "checkbox" ? "change" : "input";
    field.addEventListener(ev, () => {
      clearError(field);
      updateFieldState(field);
    });
    // Слушатель для потери фокуса
    if (field.type !== "checkbox") {
      field.addEventListener("blur", () => {
        updateFieldState(field);
      });
    }

    // Слушатель для фокуса
    field.addEventListener("focus", () => {
      field.classList.remove("has-value", "empty");
    });

    // Подавляем стандартное UI валидации браузера
    field.addEventListener("invalid", (e) => e.preventDefault());

    // Инициализируем начальное состояние
    updateFieldState(field);
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

    if (!ok) return;

    // prepare payload
    const payload = {
      name: fields.name.value.trim(),
      email: fields.email.value.trim(),
      phone: fields.phone.value.trim(),
      text: fields.text.value.trim(),
    };

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
      const closeBtn = overlay.querySelector("#closeModal");
      const okBtn = overlay.querySelector("#okBtn");
      if (closeBtn) closeBtn.addEventListener("click", closeModal);
      if (okBtn) okBtn.addEventListener("click", closeModal);
      // close when clicking outside modal
      overlay.addEventListener("click", (ev) => {
        if (ev.target === overlay) closeModal();
      });
    }

    // Функция для полного сброса формы
    function resetFormState() {
      // Сбрасываем форму
      form.reset();

      // Сбрасываем маску телефона
      if (phoneMask) {
        phoneMask.updateValue();
      }

      // Сбрасываем все классы полей
      Object.values(fields).forEach((field) => {
        if (field) {
          field.classList.remove("has-value", "empty");
          field.classList.add("empty"); // По умолчанию поле пустое
          clearError(field);
        }
      });
      // Сбрасываем чекбокс состояния
      if (fields.consent) {
        fields.consent.classList.remove("has-value", "empty");
        fields.consent.classList.add("empty");
      }
    }

    (async () => {
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Network response was not ok");
        // Сбрасываем состояние формы перед показом модального окна
        resetFormState();
        openModal();
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
