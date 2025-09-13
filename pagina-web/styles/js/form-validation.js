/* ===========================
   VALIDACIÓN Y MANEJO DEL FORMULARIO
   ========================== */

class FormValidator {
    constructor(formSelector) {
        this.form = document.querySelector(formSelector);
        if (!this.form) return;
        
        this.fields = {
            nombre: {
                element: this.form.querySelector('#nombre'),
                rules: ['required', 'minLength:2', 'maxLength:50', 'name'],
                messages: {
                    required: 'El nombre es obligatorio',
                    minLength: 'El nombre debe tener al menos 2 caracteres',
                    maxLength: 'El nombre no puede exceder 50 caracteres',
                    name: 'El nombre solo puede contener letras y espacios'
                }
            },
            email: {
                element: this.form.querySelector('#email'),
                rules: ['required', 'email'],
                messages: {
                    required: 'El correo electrónico es obligatorio',
                    email: 'Ingresa un correo electrónico válido'
                }
            },
            telefono: {
                element: this.form.querySelector('#telefono'),
                rules: ['phone'],
                messages: {
                    phone: 'Ingresa un número de teléfono válido'
                }
            },
            empresa: {
                element: this.form.querySelector('#empresa'),
                rules: ['maxLength:100'],
                messages: {
                    maxLength: 'El nombre de la empresa no puede exceder 100 caracteres'
                }
            },
            servicio: {
                element: this.form.querySelector('#servicio'),
                rules: [],
                messages: {}
            },
            mensaje: {
                element: this.form.querySelector('#mensaje'),
                rules: ['required', 'minLength:10', 'maxLength:500'],
                messages: {
                    required: 'El mensaje es obligatorio',
                    minLength: 'El mensaje debe tener al menos 10 caracteres',
                    maxLength: 'El mensaje no puede exceder 500 caracteres'
                }
            }
        };
        
        this.submitBtn = this.form.querySelector('.submit-btn');
        this.isSubmitting = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupRealTimeValidation();
        this.initializeFormState();
    }

    initializeFormState() {
        // Limpiar mensajes de error al cargar
        Object.keys(this.fields).forEach(fieldName => {
            this.clearError(fieldName);
        });
    }

    setupEventListeners() {
        // Envío del formulario
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Validación en tiempo real
        Object.keys(this.fields).forEach(fieldName => {
            const field = this.fields[fieldName];
            if (field.element) {
                // Validar al salir del campo
                field.element.addEventListener('blur', () => {
                    this.validateField(fieldName);
                });
                
                // Limpiar errores al escribir
                field.element.addEventListener('input', () => {
                    if (field.element.classList.contains('invalid')) {
                        this.clearError(fieldName);
                    }
                });
            }
        });
    }

    setupRealTimeValidation() {
        // Contador de caracteres para textarea
        const mensajeField = this.fields.mensaje.element;
        if (mensajeField) {
            const counterElement = this.createCharacterCounter(mensajeField);
            
            mensajeField.addEventListener('input', () => {
                this.updateCharacterCounter(mensajeField, counterElement);
            });
        }
    }

    createCharacterCounter(textareaElement) {
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.style.cssText = `
            font-size: 0.8rem;
            color: #666;
            text-align: right;
            margin-top: 0.5rem;
            transition: color 0.3s ease;
        `;
        
        textareaElement.parentNode.insertBefore(counter, textareaElement.nextSibling);
        this.updateCharacterCounter(textareaElement, counter);
        
        return counter;
    }

    updateCharacterCounter(textareaElement, counterElement) {
        const currentLength = textareaElement.value.length;
        const maxLength = 500;
        
        counterElement.textContent = `${currentLength}/${maxLength}`;
        
        if (currentLength > maxLength * 0.9) {
            counterElement.style.color = '#f56565';
        } else if (currentLength > maxLength * 0.7) {
            counterElement.style.color = '#ed8936';
        } else {
            counterElement.style.color = '#666';
        }
    }

    validateField(fieldName) {
        const field = this.fields[fieldName];
        if (!field || !field.element) return true;

        const value = field.element.value.trim();
        const rules = field.rules;

        // Si el campo está vacío y no es requerido, es válido
        if (!value && !rules.includes('required')) {
            this.setFieldValid(fieldName);
            return true;
        }

        // Validar cada regla
        for (let rule of rules) {
            const [ruleName, ruleParam] = rule.split(':');
            const isValid = this.applyRule(value, ruleName, ruleParam);
            
            if (!isValid) {
                this.setFieldError(fieldName, field.messages[ruleName] || `Error en ${fieldName}`);
                return false;
            }
        }

        this.setFieldValid(fieldName);
        return true;
    }

    applyRule(value, ruleName, param) {
        switch (ruleName) {
            case 'required':
                return value.length > 0;
            
            case 'minLength':
                return value.length >= parseInt(param);
            
            case 'maxLength':
                return value.length <= parseInt(param);
            
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value);
            
            case 'phone':
                if (!value) return true; // Campo opcional
                const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
                return phoneRegex.test(cleanPhone) && cleanPhone.length >= 7;
            
            case 'name':
                const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
                return nameRegex.test(value);
            
            default:
                return true;
        }
    }

    setFieldError(fieldName, message) {
        const field = this.fields[fieldName];
        const errorElement = document.querySelector(`#error-${fieldName}`);
        
        if (field.element) {
            field.element.classList.remove('valid');
            field.element.classList.add('invalid');
            field.element.parentNode.classList.remove('success');
            field.element.parentNode.classList.add('error');
        }
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    setFieldValid(fieldName) {
        const field = this.fields[fieldName];
        const errorElement = document.querySelector(`#error-${fieldName}`);
        
        if (field.element && field.element.value.trim()) {
            field.element.classList.remove('invalid');
            field.element.classList.add('valid');
            field.element.parentNode.classList.remove('error');
            field.element.parentNode.classList.add('success');
        }
        
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }

    clearError(fieldName) {
        const field = this.fields[fieldName];
        const errorElement = document.querySelector(`#error-${fieldName}`);
        
        if (field.element) {
            field.element.classList.remove('invalid', 'valid');
            field.element.parentNode.classList.remove('error', 'success');
        }
        
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }

    validateForm() {
        let isValid = true;
        const errors = [];

        Object.keys(this.fields).forEach(fieldName => {
            if (!this.validateField(fieldName)) {
                isValid = false;
                errors.push(fieldName);
            }
        });

        return { isValid, errors };
    }

    async handleSubmit() {
        if (this.isSubmitting) return;

        const validation = this.validateForm();
        
        if (!validation.isValid) {
            this.showFormError('Por favor, corrige los errores antes de enviar');
            // Hacer scroll al primer error
            const firstErrorField = this.fields[validation.errors[0]];
            if (firstErrorField && firstErrorField.element) {
                firstErrorField.element.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
                firstErrorField.element.focus();
            }
            return;
        }

        try {
            this.setSubmitState('loading');
            await this.submitForm();
            this.setSubmitState('success');
            this.showSuccessMessage();
            this.resetForm();
        } catch (error) {
            this.setSubmitState('error');
            this.showFormError('Error al enviar el formulario. Por favor, intenta nuevamente.');
            console.error('Error:', error);
        }
    }

    async submitForm() {
        // Simular envío del formulario
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // En un proyecto real, aquí harías la petición al servidor
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simular éxito o error aleatoriamente para demo
                if (Math.random() > 0.1) { // 90% éxito
                    console.log('Datos del formulario:', data);
                    resolve(data);
                } else {
                    reject(new Error('Error simulado del servidor'));
                }
            }, 2000);
        });
    }

    setSubmitState(state) {
        const btnText = this.submitBtn.querySelector('.btn-text');
        const btnLoader = this.submitBtn.querySelector('.btn-loader');
        
        // Remover todas las clases de estado
        this.submitBtn.classList.remove('loading', 'success', 'error');
        
        switch (state) {
            case 'loading':
                this.isSubmitting = true;
                this.submitBtn.classList.add('loading');
                this.submitBtn.disabled = true;
                btnLoader.textContent = 'Enviando...';
                break;
                
            case 'success':
                this.submitBtn.classList.add('success');
                btnText.textContent = '¡Mensaje Enviado!';
                setTimeout(() => {
                    this.resetSubmitButton();
                }, 3000);
                break;
                
            case 'error':
                this.submitBtn.classList.add('error');
                this.submitBtn.disabled = false;
                this.isSubmitting = false;
                setTimeout(() => {
                    this.resetSubmitButton();
                }, 3000);
                break;
                
            default:
                this.resetSubmitButton();
        }
    }

    resetSubmitButton() {
        this.isSubmitting = false;
        this.submitBtn.disabled = false;
        this.submitBtn.classList.remove('loading', 'success', 'error');
        
        const btnText = this.submitBtn.querySelector('.btn-text');
        btnText.textContent = 'Enviar Mensaje';
    }

    showSuccessMessage() {
        const message = this.createNotification(
            '¡Mensaje enviado exitosamente!',
            'Gracias por contactarnos. Te responderemos pronto.',
            'success'
        );
        this.showNotification(message);
    }

    showFormError(errorText) {
        const message = this.createNotification(
            'Error en el formulario',
            errorText,
            'error'
        );
        this.showNotification(message);
    }

    createNotification(title, message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
        
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">${icon}</div>
                <div class="notification-text">
                    <div class="notification-title">${title}</div>
                    <div class="notification-message">${message}</div>
                </div>
                <button class="notification-close" aria-label="Cerrar">×</button>
            </div>
        `;
        
        return notification;
    }

    showNotification(notification) {
        document.body.appendChild(notification);
        
        // Mostrar con animación
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Auto-cerrar después de 5 segundos
        const autoCloseTimer = setTimeout(() => {
            this.hideNotification(notification);
        }, 5000);
        
        // Cerrar manualmente
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            clearTimeout(autoCloseTimer);
            this.hideNotification(notification);
        });
    }

    hideNotification(notification) {
        notification.classList.add('hide');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    resetForm() {
        // Limpiar todos los campos
        this.form.reset();
        
        // Remover clases de validación
        Object.keys(this.fields).forEach(fieldName => {
            this.clearError(fieldName);
        });
        
        // Actualizar contador de caracteres
        const counterElement = document.querySelector('.character-counter');
        if (counterElement) {
            counterElement.textContent = '0/500';
            counterElement.style.color = '#666';
        }
        
        // Resetear botón después de un tiempo
        setTimeout(() => {
            this.resetSubmitButton();
        }, 3000);
    }
}

/* ===========================
   UTILIDADES DEL FORMULARIO
   ========================== */

class FormUtils {
    // Formatear número de teléfono
    static formatPhone(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length >= 10) {
            value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        }
        input.value = value;
    }

    // Capitalizar nombre
    static capitalizeName(input) {
        input.value = input.value.replace(/\b\w/g, letter => letter.toUpperCase());
    }

    // Limpiar y validar email
    static cleanEmail(input) {
        input.value = input.value.toLowerCase().trim();
    }
}

/* ===========================
   MEJORAS DE UX
   ========================== */

class FormEnhancements {
    constructor(formSelector) {
        this.form = document.querySelector(formSelector);
        if (!this.form) return;
        
        this.init();
    }

    init() {
        this.setupFieldFormatting();
        this.setupProgressIndicator();
        this.setupFieldAnimations();
    }

    setupFieldFormatting() {
        // Formateo automático del teléfono
        const phoneField = this.form.querySelector('#telefono');
        if (phoneField) {
            phoneField.addEventListener('input', () => {
                FormUtils.formatPhone(phoneField);
            });
        }

        // Capitalización automática del nombre
        const nameField = this.form.querySelector('#nombre');
        if (nameField) {
            nameField.addEventListener('blur', () => {
                FormUtils.capitalizeName(nameField);
            });
        }

        // Limpieza automática del email
        const emailField = this.form.querySelector('#email');
        if (emailField) {
            emailField.addEventListener('blur', () => {
                FormUtils.cleanEmail(emailField);
            });
        }
    }

    setupProgressIndicator() {
        const requiredFields = this.form.querySelectorAll('[required]');
        let progressBar = this.form.querySelector('.form-progress');
        
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.className = 'form-progress';
            progressBar.innerHTML = `
                <div class="form-progress-bar">
                    <div class="form-progress-fill"></div>
                </div>
                <div class="form-progress-text">0% completado</div>
            `;
            this.form.insertBefore(progressBar, this.form.firstChild);
        }

        const updateProgress = () => {
            let filledFields = 0;
            requiredFields.forEach(field => {
                if (field.value.trim()) filledFields++;
            });

            const progress = Math.round((filledFields / requiredFields.length) * 100);
            const progressFill = progressBar.querySelector('.form-progress-fill');
            const progressText = progressBar.querySelector('.form-progress-text');
            
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `${progress}% completado`;
            
            // Cambiar color basado en progreso
            if (progress === 100) {
                progressFill.style.background = '#48bb78';
            } else if (progress >= 50) {
                progressFill.style.background = '#ed8936';
            } else {
                progressFill.style.background = '#667eea';
            }
        };

        requiredFields.forEach(field => {
            field.addEventListener('input', updateProgress);
            field.addEventListener('blur', updateProgress);
        });

        updateProgress();
    }

    setupFieldAnimations() {
        const fields = this.form.querySelectorAll('input, select, textarea');
        
        fields.forEach(field => {
            // Efecto de focus
            field.addEventListener('focus', () => {
                field.parentNode.classList.add('focused');
            });
            
            field.addEventListener('blur', () => {
                field.parentNode.classList.remove('focused');
            });
            
            // Efecto de typing
            let typingTimer;
            field.addEventListener('input', () => {
                field.parentNode.classList.add('typing');
                clearTimeout(typingTimer);
                typingTimer = setTimeout(() => {
                    field.parentNode.classList.remove('typing');
                }, 1000);
            });
        });
    }
}

/* ===========================
   INICIALIZACIÓN
   ========================== */

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar validador del formulario
    new FormValidator('#contactForm');
    
    // Inicializar mejoras de UX
    new FormEnhancements('#contactForm');
});

/* ===========================
   ESTILOS CSS PARA FUNCIONALIDADES JS
   ========================== */

const formStyles = `
    <style>
    /* Notificaciones */
    .notification {
        position: fixed;
        top: 2rem;
        right: 2rem;
        max-width: 400px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification.hide {
        transform: translateX(100%);
    }
    
    .notification-success {
        border-left: 5px solid #48bb78;
    }
    
    .notification-error {
        border-left: 5px solid #f56565;
    }
    
    .notification-content {
        display: flex;
        align-items: flex-start;
        padding: 1.5rem;
        gap: 1rem;
    }
    
    .notification-icon {
        font-size: 1.5rem;
        flex-shrink: 0;
    }
    
    .notification-text {
        flex: 1;
    }
    
    .notification-title {
        font-weight: 600;
        font-size: 1rem;
        margin-bottom: 0.25rem;
        color: #2d3748;
    }
    
    .notification-message {
        font-size: 0.9rem;
        color: #4a5568;
        line-height: 1.4;
    }
    
    .notification-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #a0aec0;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.2s ease;
    }
    
    .notification-close:hover {
        background: #f7fafc;
        color: #2d3748;
    }
    
    /* Progreso del formulario */
    .form-progress {
        margin-bottom: 2rem;
        padding: 1rem;
        background: #f7fafc;
        border-radius: 12px;
        border: 1px solid #e2e8f0;
    }
    
    .form-progress-bar {
        width: 100%;
        height: 8px;
        background: #e2e8f0;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 0.5rem;
    }
    
    .form-progress-fill {
        height: 100%;
        background: #667eea;
        transition: width 0.3s ease, background 0.3s ease;
        border-radius: 4px;
    }
    
    .form-progress-text {
        font-size: 0.875rem;
        color: #4a5568;
        text-align: center;
        font-weight: 500;
    }
    
    /* Estados de campo mejorados */
    .form-group.focused {
        transform: scale(1.02);
    }
    
    .form-group.typing label {
        color: #667eea;
    }
    
    /* Contador de caracteres */
    .character-counter {
        font-size: 0.8rem;
        color: #666;
        text-align: right;
        margin-top: 0.5rem;
        transition: color 0.3s ease;
    }
    
    /* Estados del botón mejorados */
    .submit-btn.error {
        background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
        animation: shake 0.5s ease-in-out;
    }
    
    /* Responsive para notificaciones */
    @media (max-width: 768px) {
        .notification {
            top: 1rem;
            right: 1rem;
            left: 1rem;
            max-width: none;
        }
        
        .notification-content {
            padding: 1rem;
        }
    }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', formStyles);