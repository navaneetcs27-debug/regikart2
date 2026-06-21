document.addEventListener('DOMContentLoaded',()=>{
  // Dropdown Toggle
  const dropdownBtn = document.getElementById('dropdown-btn')
  const dropdownMenu = document.getElementById('dropdown-menu')
  if(dropdownBtn && dropdownMenu){
    dropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      const isExpanded = dropdownBtn.getAttribute('aria-expanded') === 'true'
      dropdownBtn.setAttribute('aria-expanded', !isExpanded)
      dropdownMenu.classList.toggle('show')
    })
    
    document.addEventListener('click', (e) => {
      if(!dropdownBtn.contains(e.target) && !dropdownMenu.contains(e.target)){
        dropdownBtn.setAttribute('aria-expanded', 'false')
        dropdownMenu.classList.remove('show')
      }
    })
  }

  // Quick quote form handler
  const qForm = document.getElementById('quick-quote')
  if(qForm){
    qForm.addEventListener('submit', e => {
      e.preventDefault()
      const name = document.getElementById('q-name')?.value || ''
      const phone = document.getElementById('q-phone')?.value || ''
      const service = document.getElementById('q-service')?.value || ''
      const msg = encodeURIComponent(`Hi Regikart, I need help with: ${service}. Name: ${name}. Phone: ${phone}`)
      window.open(`https://wa.me/917044494804?text=${msg}`, '_blank')
    })
  }

  // Main contact form handler (requests a quote)
  const mainForm = document.getElementById('signup-form')
  if(mainForm){
    mainForm.addEventListener('submit', e => {
      e.preventDefault()
      const name = document.getElementById('name')?.value || ''
      const phone = document.getElementById('phone')?.value || ''
      const service = document.getElementById('service-choice')?.value || ''
      const msg = encodeURIComponent(`Hi Regikart, I need help with: ${service}. Name: ${name}. Phone: ${phone}`)
      window.open(`https://wa.me/917044494804?text=${msg}`, '_blank')
      mainForm.reset()
    })
  }

  // Generic form handler for all forms with class 'whatsapp-form'
  document.querySelectorAll('form.whatsapp-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault()
      const formData = new FormData(form)
      let msgParts = []
      const serviceName = form.getAttribute('data-service') || 'General Inquiry'
      msgParts.push(`Hi Regikart, I need help with: ${serviceName}.`)
      
      formData.forEach((value, key) => {
        if (value && value.trim() !== '') {
          // Format label (e.g. "q-name" -> "Name")
          let label = key.replace('q-', '').replace('-', ' ')
          label = label.charAt(0).toUpperCase() + label.slice(1)
          msgParts.push(`${label}: ${value}`)
        }
      })
      
      const msg = encodeURIComponent(msgParts.join('\n'))
      window.open(`https://wa.me/917044494804?text=${msg}`, '_blank')
      form.reset()
    })
  })

  // 1. Theme Toggle Logic
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeButtons();
    });
  });

  function updateThemeButtons() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    themeToggleBtns.forEach(btn => {
      if (currentTheme === 'dark') {
        btn.innerHTML = '☀️ Light Mode';
      } else {
        btn.innerHTML = '🌙 Dark Mode';
      }
    });
  }
  updateThemeButtons();

  // 2. FAQ Accordion Logic
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const isActive = item.classList.contains('active');
      
      // Close all other FAQs
      document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));
      
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // 3. Calculators Logic
  const calcTabs = document.querySelectorAll('.calc-tab');
  const calcPanels = document.querySelectorAll('.calc-panel');
  calcTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      calcTabs.forEach(t => t.classList.remove('active'));
      calcPanels.forEach(p => p.classList.remove('active'));
      
      tab.classList.add('active');
      const calcType = tab.getAttribute('data-calc');
      document.getElementById(`calc-${calcType}`)?.classList.add('active');
    });
  });

  // GST Calculator logic
  const gstAmountInput = document.getElementById('gst-amount');
  const gstRateSelect = document.getElementById('gst-rate');
  const gstTypeRadios = document.querySelectorAll('input[name="gst-type"]');

  function calculateGST() {
    if (!gstAmountInput || !gstRateSelect) return;
    const amount = parseFloat(gstAmountInput.value) || 0;
    const rate = parseFloat(gstRateSelect.value) || 18;
    let inclusive = false;
    gstTypeRadios.forEach(radio => {
      if (radio.checked && radio.value === 'inclusive') inclusive = true;
    });

    let base = 0;
    let gstTax = 0;
    let total = 0;

    if (inclusive) {
      base = amount / (1 + (rate / 100));
      gstTax = amount - base;
      total = amount;
    } else {
      base = amount;
      gstTax = amount * (rate / 100);
      total = amount + gstTax;
    }

    const cgst = gstTax / 2;
    const sgst = gstTax / 2;

    const formatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });

    const baseEl = document.getElementById('res-base');
    const cgstEl = document.getElementById('res-cgst');
    const sgstEl = document.getElementById('res-sgst');
    const totalGstEl = document.getElementById('res-total-gst');
    const totalPayableEl = document.getElementById('res-total-payable');

    if (baseEl) baseEl.textContent = formatter.format(base);
    if (cgstEl) cgstEl.textContent = formatter.format(cgst);
    if (sgstEl) sgstEl.textContent = formatter.format(sgst);
    if (totalGstEl) totalGstEl.textContent = formatter.format(gstTax);
    if (totalPayableEl) totalPayableEl.textContent = formatter.format(total);
  }

  if (gstAmountInput) {
    gstAmountInput.addEventListener('input', calculateGST);
    gstRateSelect.addEventListener('change', calculateGST);
    gstTypeRadios.forEach(r => r.addEventListener('change', calculateGST));
    calculateGST();
  }

  // Tax Calculator logic
  const taxIncomeInput = document.getElementById('tax-income');
  const taxDeductionsInput = document.getElementById('tax-deductions');

  function calculateTax() {
    if (!taxIncomeInput) return;
    const income = parseFloat(taxIncomeInput.value) || 0;
    const deductions = parseFloat(taxDeductionsInput?.value) || 0;

    // OLD REGIME CALCULATION
    const oldTaxable = Math.max(0, income - deductions - 50000);
    let oldTax = 0;
    if (oldTaxable <= 250000) {
      oldTax = 0;
    } else if (oldTaxable <= 500000) {
      oldTax = (oldTaxable - 250000) * 0.05;
    } else if (oldTaxable <= 1000000) {
      oldTax = 12500 + (oldTaxable - 500000) * 0.20;
    } else {
      oldTax = 112500 + (oldTaxable - 1000000) * 0.30;
    }
    if (oldTaxable <= 500000) {
      oldTax = 0;
    }
    const oldTaxWithCess = oldTax * 1.04;

    // NEW REGIME CALCULATION
    const newTaxable = Math.max(0, income - 75000);
    let newTax = 0;
    if (newTaxable <= 300000) {
      newTax = 0;
    } else if (newTaxable <= 700000) {
      newTax = (newTaxable - 300000) * 0.05;
    } else if (newTaxable <= 1000000) {
      newTax = 20000 + (newTaxable - 700000) * 0.10;
    } else if (newTaxable <= 1200000) {
      newTax = 50000 + (newTaxable - 1000000) * 0.15;
    } else if (newTaxable <= 1500000) {
      newTax = 80000 + (newTaxable - 1200000) * 0.20;
    } else {
      newTax = 140000 + (newTaxable - 1500000) * 0.30;
    }
    if (newTaxable <= 700000) {
      newTax = 0;
    }
    const newTaxWithCess = newTax * 1.04;

    const formatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });
    const oldTaxEl = document.getElementById('res-old-tax');
    const newTaxEl = document.getElementById('res-new-tax');
    const recEl = document.getElementById('res-tax-recommendation');

    if (oldTaxEl) oldTaxEl.textContent = formatter.format(oldTaxWithCess);
    if (newTaxEl) newTaxEl.textContent = formatter.format(newTaxWithCess);

    if (recEl) {
      const diff = Math.abs(oldTaxWithCess - newTaxWithCess);
      if (oldTaxWithCess > newTaxWithCess) {
        recEl.textContent = `New Tax Regime (Saves ${formatter.format(diff)})`;
        recEl.className = 'highlight';
      } else if (newTaxWithCess > oldTaxWithCess) {
        recEl.textContent = `Old Tax Regime (Saves ${formatter.format(diff)})`;
        recEl.className = 'highlight';
      } else {
        recEl.textContent = 'Both schemes yield the same tax.';
        recEl.className = '';
      }
    }
  }

  if (taxIncomeInput) {
    taxIncomeInput.addEventListener('input', calculateTax);
    taxDeductionsInput?.addEventListener('input', calculateTax);
    calculateTax();
  }

  // 4. Compliance Calendar Filters
  const calFilters = document.querySelectorAll('.cal-filter');
  const calItems = document.querySelectorAll('.cal-item');
  calFilters.forEach(filter => {
    filter.addEventListener('click', () => {
      calFilters.forEach(f => f.classList.remove('active'));
      filter.classList.add('active');

      const filterValue = filter.getAttribute('data-filter');
      calItems.forEach(item => {
        if (filterValue === 'all' || item.getAttribute('data-type') === filterValue) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // 5. Chatbot Widget Logic
  const cbToggle = document.getElementById('chatbot-toggle');
  const cbClose = document.getElementById('chatbot-close');
  const cbWindow = document.getElementById('chatbot-window');
  const cbMessages = document.getElementById('chatbot-messages');
  const cbOptions = document.getElementById('chatbot-options');

  if (cbToggle && cbWindow) {
    cbToggle.addEventListener('click', () => {
      cbWindow.classList.toggle('show');
      cbToggle.querySelector('.chat-badge')?.remove();
    });
    
    cbClose?.addEventListener('click', () => {
      cbWindow.classList.remove('show');
    });

    cbOptions?.addEventListener('click', (e) => {
      const btn = e.target.closest('.chat-opt-btn');
      if (!btn) return;

      const action = btn.getAttribute('data-action');
      const userText = btn.textContent;

      addChatMessage(userText, 'user');

      setTimeout(() => {
        if (action === 'incorporation') {
          addChatMessage("Great! Regikart helps founders register Pvt Ltd, LLP, and OPC startups in India in less than 7 days. Pricing starts at ₹1,999 + govt fees.", 'bot');
          updateChatOptions([
            { text: "Connect with CS on WhatsApp", action: "whatsapp_inc" },
            { text: "View pricing details", action: "pricing" },
            { text: "Back to menu", action: "menu" }
          ]);
        } else if (action === 'tax') {
          addChatMessage("Filing taxes is fast & audit-proof with our CAs. We match records against AIS/Form 26AS to avoid tax notices. Rates start at ₹999.", 'bot');
          updateChatOptions([
            { text: "Connect with CA on WhatsApp", action: "whatsapp_tax" },
            { text: "Back to menu", action: "menu" }
          ]);
        } else if (action === 'accounting') {
          addChatMessage("Get a dedicated virtual accounts manager. Includes monthly bookkeeping, payroll/payslips, TDS filing, and MIS reports.", 'bot');
          updateChatOptions([
            { text: "Get accounting quote on WhatsApp", action: "whatsapp_acc" },
            { text: "Back to menu", action: "menu" }
          ]);
        } else if (action === 'whatsapp') {
          addChatMessage("Connecting you directly to our qualified Chartered Accountants on WhatsApp...", 'bot');
          window.open("https://wa.me/917044494804?text=Hi%20Regikart%2C%20I%20need%20expert%20compliance%20help.", "_blank");
          updateChatOptions([
            { text: "Back to menu", action: "menu" }
          ]);
        } else if (action === 'whatsapp_inc') {
          window.open("https://wa.me/917044494804?text=Hi%20Regikart%2C%20I%20want%20to%20register%20a%20company.", "_blank");
          addChatMessage("WhatsApp redirect opened! Feel free to ask more questions here or chat on WhatsApp.", 'bot');
        } else if (action === 'whatsapp_tax') {
          window.open("https://wa.me/917044494804?text=Hi%20Regikart%2C%20I%20want%20to%20file%20my%20ITR.", "_blank");
          addChatMessage("WhatsApp redirect opened!", 'bot');
        } else if (action === 'whatsapp_acc') {
          window.open("https://wa.me/917044494804?text=Hi%20Regikart%2C%20I%20need%20monthly%20accounting%20services.", "_blank");
          addChatMessage("WhatsApp redirect opened!", 'bot');
        } else if (action === 'pricing') {
          addChatMessage("Registration: ₹1,999 onwards\nTax return: ₹999 onwards\nAccounting: flat-monthly custom quote.\nNo hidden markups.", 'bot');
          updateChatOptions([
            { text: "Connect on WhatsApp", action: "whatsapp" },
            { text: "Back to menu", action: "menu" }
          ]);
        } else if (action === 'menu') {
          addChatMessage("What can I assist you with next?", 'bot');
          updateChatOptions([
            { text: "Register Company", action: "incorporation" },
            { text: "File Income Tax", action: "tax" },
            { text: "Accounting & payroll", action: "accounting" },
            { text: "Talk to a live CA", action: "whatsapp" }
          ]);
        }
      }, 600);
    });
  }

  function addChatMessage(text, sender) {
    if (!cbMessages) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${sender}`;
    msgDiv.innerHTML = text.replace(/\n/g, '<br>');
    cbMessages.appendChild(msgDiv);
    cbMessages.scrollTop = cbMessages.scrollHeight;
  }

  function updateChatOptions(opts) {
    if (!cbOptions) return;
    cbOptions.innerHTML = '';
    opts.forEach(o => {
      const btn = document.createElement('button');
      btn.className = 'chat-opt-btn';
      btn.setAttribute('data-action', o.action);
      btn.textContent = o.text;
      cbOptions.appendChild(btn);
    });
  }

  // Smooth scroll for internal anchors
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      const href = a.getAttribute('href')
      if(href && href.startsWith('#')){
        const target = document.querySelector(href)
        if(target){
          e.preventDefault()
          target.scrollIntoView({behavior:'smooth',block:'start'})
        }
      }
    })
  })
})
