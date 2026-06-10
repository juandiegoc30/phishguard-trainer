window.PHISHGUARD_DATA = {
  "scenarios": {
    "es": [
      {
        "id": "co-bank-urgent-verification",
        "title": "Verificación urgente de cuenta bancaria",
        "difficulty": "Fácil",
        "type": "Correo sospechoso",
        "context": "Recibiste este correo supuestamente enviado por una entidad financiera. Revisa el mensaje y marca las señales sospechosas.",
        "learning_goal": "Identificar urgencia artificial, dominios engañosos y solicitud indebida de datos financieros.",
        "mock_ui": {
          "mode": "email",
          "sender_label": "De",
          "sender": "seguridad@bancoseguro-co.com",
          "subject_label": "Asunto",
          "subject": "Tu cuenta será bloqueada hoy a las 6:00 p. m.",
          "preheader": "Verificación obligatoria de identidad pendiente.",
          "body": [
            "Estimado usuario,",
            "Detectamos movimientos inusuales en tu cuenta. Para evitar el bloqueo preventivo, debes validar tu identidad antes de las 6:00 p. m. de hoy.",
            "Por seguridad, ingresa tu número de documento, clave principal y código recibido por SMS en el enlace de verificación.",
            "Si no completas el proceso, tus productos quedarán suspendidos temporalmente."
          ],
          "button": "Validar identidad ahora",
          "link_preview": "https://bancoseguro-co.com/verificacion/cliente",
          "footer": "Área de Seguridad Digital"
        },
        "elements": [
          {
            "id": "sender_domain",
            "label": "Dominio del remitente",
            "display": "seguridad@bancoseguro-co.com",
            "is_suspicious": true,
            "explanation": "El dominio intenta parecer legítimo, pero usa una composición genérica y no verificable. En correos financieros siempre debes comprobar el dominio oficial desde canales independientes."
          },
          {
            "id": "deadline_pressure",
            "label": "Presión por tiempo límite",
            "display": "será bloqueada hoy a las 6:00 p. m.",
            "is_suspicious": true,
            "explanation": "La urgencia artificial busca que actúes sin verificar. Es común en phishing financiero."
          },
          {
            "id": "credential_request",
            "label": "Solicitud de clave y código SMS",
            "display": "clave principal y código recibido por SMS",
            "is_suspicious": true,
            "explanation": "Una entidad legítima no debería solicitar claves completas ni códigos de autenticación mediante enlaces de correo."
          },
          {
            "id": "generic_greeting",
            "label": "Saludo genérico",
            "display": "Estimado usuario",
            "is_suspicious": true,
            "explanation": "No prueba phishing por sí solo, pero junto con urgencia y solicitud de credenciales aumenta el riesgo."
          },
          {
            "id": "security_team_footer",
            "label": "Firma de seguridad genérica",
            "display": "Área de Seguridad Digital",
            "is_suspicious": false,
            "explanation": "Una firma genérica no es suficiente para confirmar autenticidad ni para descartarla. Debe analizarse junto con los demás indicadores."
          }
        ]
      },
      {
        "id": "co-tax-refund-sms",
        "title": "Mensaje de devolución de IVA",
        "difficulty": "Media",
        "type": "SMS / enlace corto",
        "context": "Recibiste un mensaje indicando que tienes una devolución de IVA pendiente. Identifica las señales de riesgo.",
        "learning_goal": "Reconocer enlaces acortados, promesas de dinero y solicitud innecesaria de datos personales.",
        "mock_ui": {
          "mode": "sms",
          "sender_label": "Remitente",
          "sender": "InfoGob",
          "subject_label": "Mensaje",
          "subject": "Devolución disponible",
          "body": [
            "Tiene una devolución de IVA aprobada por $428.900 COP.",
            "Actualice sus datos bancarios antes de 24 horas para recibir el pago.",
            "Ingrese aquí: https://pagos-co.info/tx/82A9"
          ],
          "button": "Abrir enlace",
          "link_preview": "https://pagos-co.info/tx/82A9",
          "footer": "Mensaje automático. No responda."
        },
        "elements": [
          {
            "id": "money_promise",
            "label": "Promesa de devolución de dinero",
            "display": "$428.900 COP aprobados",
            "is_suspicious": true,
            "explanation": "Las promesas de dinero son un gancho frecuente para que el usuario entregue datos bancarios."
          },
          {
            "id": "short_deadline",
            "label": "Plazo corto",
            "display": "antes de 24 horas",
            "is_suspicious": true,
            "explanation": "Los plazos artificiales reducen el análisis crítico y empujan a actuar rápido."
          },
          {
            "id": "bank_data_request",
            "label": "Actualización de datos bancarios",
            "display": "Actualice sus datos bancarios",
            "is_suspicious": true,
            "explanation": "Pedir datos bancarios desde un SMS con enlace es una señal de alto riesgo."
          },
          {
            "id": "suspicious_domain",
            "label": "Dominio no institucional",
            "display": "pagos-co.info",
            "is_suspicious": true,
            "explanation": "El dominio no corresponde claramente a una entidad oficial. Debes acceder escribiendo la dirección oficial en el navegador, no desde el enlace."
          },
          {
            "id": "no_reply_footer",
            "label": "Mensaje automático",
            "display": "No responda",
            "is_suspicious": false,
            "explanation": "Muchos mensajes legítimos son automáticos. Esta señal por sí sola no demuestra phishing."
          }
        ]
      },
      {
        "id": "co-university-email-quota",
        "title": "Cuota de correo institucional",
        "difficulty": "Media",
        "type": "Correo universitario",
        "context": "Un supuesto soporte tecnológico universitario te pide ampliar la cuota de correo. Revisa el mensaje.",
        "learning_goal": "Detectar suplantación de soporte, enlaces externos y solicitud de contraseña institucional.",
        "mock_ui": {
          "mode": "email",
          "sender_label": "De",
          "sender": "soporte.ti@portal-academico.co",
          "subject_label": "Asunto",
          "subject": "Su buzón institucional alcanzó el 98% de capacidad",
          "preheader": "Evite la desactivación de su correo académico.",
          "body": [
            "Estimado miembro de la comunidad académica,",
            "Su buzón institucional alcanzó el 98% de capacidad. Para evitar la suspensión, confirme sus datos de acceso y solicite ampliación gratuita.",
            "El proceso toma menos de un minuto. Debe ingresar correo, contraseña y teléfono de recuperación.",
            "Este enlace vence al finalizar el día."
          ],
          "button": "Ampliar cuota ahora",
          "link_preview": "https://portal-academico.co/mail/quota",
          "footer": "Mesa de Ayuda Tecnológica"
        },
        "elements": [
          {
            "id": "external_domain",
            "label": "Dominio externo",
            "display": "portal-academico.co",
            "is_suspicious": true,
            "explanation": "El dominio no permite confirmar que pertenezca a la institución. En servicios académicos se debe verificar el dominio oficial."
          },
          {
            "id": "password_request",
            "label": "Solicitud de contraseña",
            "display": "correo, contraseña y teléfono de recuperación",
            "is_suspicious": true,
            "explanation": "Soporte legítimo no debe pedir la contraseña del usuario mediante un formulario enlazado desde correo."
          },
          {
            "id": "same_day_expiration",
            "label": "Vencimiento el mismo día",
            "display": "vence al finalizar el día",
            "is_suspicious": true,
            "explanation": "El vencimiento inmediato aumenta la presión y reduce la verificación."
          },
          {
            "id": "generic_community",
            "label": "Saludo genérico institucional",
            "display": "miembro de la comunidad académica",
            "is_suspicious": true,
            "explanation": "Los mensajes genéricos son comunes en campañas masivas. No son prueba definitiva, pero elevan la sospecha."
          },
          {
            "id": "mail_quota_topic",
            "label": "Tema de cuota de correo",
            "display": "98% de capacidad",
            "is_suspicious": false,
            "explanation": "La cuota de correo puede ser un aviso legítimo. El problema está en el enlace externo y la solicitud de contraseña."
          }
        ]
      },
      {
        "id": "co-traffic-fine-sms",
        "title": "Notificación de comparendo pendiente",
        "difficulty": "Media",
        "type": "SMS / enlace de pago",
        "context": "Recibiste un SMS sobre un supuesto comparendo de tránsito con descuento por pronto pago. Revisa el mensaje y marca las señales sospechosas.",
        "learning_goal": "Reconocer smishing asociado a multas, descuentos urgentes y enlaces de pago no verificables.",
        "mock_ui": {
          "mode": "sms",
          "sender_label": "Remitente",
          "sender": "TransitoCO",
          "subject_label": "Mensaje",
          "subject": "Comparendo pendiente",
          "body": [
            "Tiene un comparendo pendiente por $586.400 COP.",
            "Pague hoy con 50% de descuento y evite reporte o inmovilización.",
            "Consulte y pague aquí: https://movilidad-pagos.co/c/7341"
          ],
          "button": "Consultar comparendo",
          "link_preview": "https://movilidad-pagos.co/c/7341",
          "footer": "Notificación automática. No responda."
        },
        "elements": [
          {
            "id": "fine_lure",
            "label": "Supuesto comparendo",
            "display": "comparendo pendiente por $586.400 COP",
            "is_suspicious": true,
            "explanation": "Las multas o comparendos son un gancho frecuente porque generan preocupación inmediata y empujan a pagar rápido."
          },
          {
            "id": "discount_pressure",
            "label": "Descuento por tiempo limitado",
            "display": "Pague hoy con 50% de descuento",
            "is_suspicious": true,
            "explanation": "El descuento urgente busca que la persona actúe sin verificar en el portal oficial de la autoridad de tránsito."
          },
          {
            "id": "threat_language",
            "label": "Amenaza de consecuencia inmediata",
            "display": "evite reporte o inmovilización",
            "is_suspicious": true,
            "explanation": "Las amenazas de reporte o inmovilización aumentan la presión. Deben verificarse por canales oficiales, no desde el enlace del SMS."
          },
          {
            "id": "payment_domain",
            "label": "Dominio de pago no verificable",
            "display": "movilidad-pagos.co",
            "is_suspicious": true,
            "explanation": "El dominio parece relacionado con movilidad, pero no permite confirmar que sea un sitio oficial. Es mejor escribir manualmente la dirección oficial de la entidad."
          },
          {
            "id": "auto_footer",
            "label": "Notificación automática",
            "display": "No responda",
            "is_suspicious": false,
            "explanation": "Que el mensaje sea automático no demuestra fraude por sí solo. El riesgo está en el pago urgente, la amenaza y el enlace."
          }
        ]
      }
    ],
    "en": [
      {
        "id": "us-payroll-verification",
        "title": "Payroll verification request",
        "difficulty": "Easy",
        "type": "Suspicious email",
        "context": "You received an email that appears to come from a payroll department. Review the message and select the suspicious signals.",
        "learning_goal": "Identify payroll-themed phishing using urgency, lookalike domains, and credential requests.",
        "mock_ui": {
          "mode": "email",
          "sender_label": "From",
          "sender": "payroll@workbenefits-update.com",
          "subject_label": "Subject",
          "subject": "Action required: direct deposit confirmation",
          "preheader": "Confirm your payroll details before the next payment cycle.",
          "body": [
            "Hello employee,",
            "Your direct deposit information must be confirmed before the next payroll cycle. Failure to complete this update may delay your payment.",
            "Use the secure form below to verify your employee ID, account number, routing number, and work password.",
            "This request expires today at 5:00 PM Eastern Time."
          ],
          "button": "Confirm payroll details",
          "link_preview": "https://workbenefits-update.com/payroll/secure",
          "footer": "Payroll Operations Center"
        },
        "elements": [
          {
            "id": "sender_domain",
            "label": "Sender domain",
            "display": "payroll@workbenefits-update.com",
            "is_suspicious": true,
            "explanation": "The domain sounds official but does not clearly match a known employer-owned domain. Lookalike domains are common in payroll phishing."
          },
          {
            "id": "payment_pressure",
            "label": "Payment pressure",
            "display": "may delay your payment",
            "is_suspicious": true,
            "explanation": "Threatening delayed payment creates pressure and may cause users to skip verification."
          },
          {
            "id": "banking_data",
            "label": "Banking data request",
            "display": "account number and routing number",
            "is_suspicious": true,
            "explanation": "Sensitive payroll and banking details should not be collected through an email link without strong verification."
          },
          {
            "id": "work_password",
            "label": "Password request",
            "display": "work password",
            "is_suspicious": true,
            "explanation": "A legitimate payroll form should not ask for the user's work password."
          },
          {
            "id": "payroll_footer",
            "label": "Generic payroll footer",
            "display": "Payroll Operations Center",
            "is_suspicious": false,
            "explanation": "A generic footer is not enough to prove fraud by itself. It must be evaluated with the sender, link, and requested information."
          }
        ]
      },
      {
        "id": "us-delivery-fee-sms",
        "title": "Package delivery fee notice",
        "difficulty": "Medium",
        "type": "SMS / mobile message",
        "context": "You received a text message about a failed package delivery and a small unpaid fee. Identify the risky elements.",
        "learning_goal": "Recognize package-delivery phishing using small fees, short deadlines, and suspicious links.",
        "mock_ui": {
          "mode": "sms",
          "sender_label": "Sender",
          "sender": "DeliveryNotice",
          "subject_label": "Message",
          "subject": "Package on hold",
          "body": [
            "Your package is on hold due to an unpaid $1.98 redelivery fee.",
            "Update your delivery address and pay the fee within 12 hours to avoid return to sender.",
            "Continue here: https://delivery-track-us.info/order/8841"
          ],
          "button": "Open link",
          "link_preview": "https://delivery-track-us.info/order/8841",
          "footer": "Automated delivery notification"
        },
        "elements": [
          {
            "id": "small_fee",
            "label": "Small fee lure",
            "display": "$1.98 redelivery fee",
            "is_suspicious": true,
            "explanation": "Small fees are often used to lower suspicion and trick users into entering payment card details."
          },
          {
            "id": "short_deadline",
            "label": "Short deadline",
            "display": "within 12 hours",
            "is_suspicious": true,
            "explanation": "A short deadline creates urgency and discourages independent verification."
          },
          {
            "id": "address_payment",
            "label": "Address and payment update",
            "display": "Update your delivery address and pay the fee",
            "is_suspicious": true,
            "explanation": "Combining address updates with payment collection from a text link is risky."
          },
          {
            "id": "suspicious_link",
            "label": "Suspicious link",
            "display": "delivery-track-us.info",
            "is_suspicious": true,
            "explanation": "The domain is generic and not clearly tied to a real carrier. Users should verify through the official carrier website or app."
          },
          {
            "id": "automated_footer",
            "label": "Automated notification text",
            "display": "Automated delivery notification",
            "is_suspicious": false,
            "explanation": "Automated notices can be legitimate. The risk comes from the link, fee, and urgency."
          }
        ]
      },
      {
        "id": "us-mfa-reset-alert",
        "title": "MFA reset alert",
        "difficulty": "Hard",
        "type": "Security notification",
        "context": "A security notification claims your multi-factor authentication was reset. Review the signals before acting.",
        "learning_goal": "Learn to spot MFA fatigue and account recovery scams involving security-themed messages.",
        "mock_ui": {
          "mode": "email",
          "sender_label": "From",
          "sender": "security@account-verifycenter.com",
          "subject_label": "Subject",
          "subject": "MFA reset detected on your account",
          "preheader": "If this was not you, cancel the reset immediately.",
          "body": [
            "A new authentication device was added to your account from Austin, TX.",
            "If you did not request this change, cancel the reset immediately using the secure recovery page.",
            "To stop the change, enter your username, password, and current verification code.",
            "You have 15 minutes before the reset becomes permanent."
          ],
          "button": "Cancel MFA reset",
          "link_preview": "https://account-verifycenter.com/recovery/mfa",
          "footer": "Account Security Notifications"
        },
        "elements": [
          {
            "id": "security_theme",
            "label": "Security-themed message",
            "display": "MFA reset detected",
            "is_suspicious": false,
            "explanation": "Security alerts can be legitimate. The theme alone is not suspicious, but it becomes risky when paired with credential requests and urgency."
          },
          {
            "id": "lookalike_domain",
            "label": "Lookalike domain",
            "display": "account-verifycenter.com",
            "is_suspicious": true,
            "explanation": "The domain uses security-related words but does not clearly identify a legitimate account provider."
          },
          {
            "id": "verification_code_request",
            "label": "Verification code request",
            "display": "current verification code",
            "is_suspicious": true,
            "explanation": "Never provide verification codes from a link in an email. Attackers use this to bypass MFA."
          },
          {
            "id": "fifteen_minutes",
            "label": "15-minute deadline",
            "display": "15 minutes before the reset becomes permanent",
            "is_suspicious": true,
            "explanation": "Tight deadlines are used to trigger panic and reduce careful verification."
          },
          {
            "id": "cancel_button",
            "label": "Cancel reset button",
            "display": "Cancel MFA reset",
            "is_suspicious": true,
            "explanation": "A button framed as protective can still lead to a credential-harvesting page. Verify through the official website or app instead."
          }
        ]
      },
      {
        "id": "us-toll-payment-sms",
        "title": "Unpaid toll payment notice",
        "difficulty": "Medium",
        "type": "SMS / payment link",
        "context": "You received a text message about an unpaid toll balance and a same-day penalty. Identify the risky elements.",
        "learning_goal": "Recognize smishing that uses small toll fees, penalty threats, and generic payment links.",
        "mock_ui": {
          "mode": "sms",
          "sender_label": "Sender",
          "sender": "TollNotice",
          "subject_label": "Message",
          "subject": "Unpaid toll",
          "body": [
            "You have an unpaid toll balance of $6.75.",
            "Pay today to avoid a $39.00 late penalty and vehicle registration hold.",
            "Review payment: https://toll-pay-us.info/notice/5092"
          ],
          "button": "Review payment",
          "link_preview": "https://toll-pay-us.info/notice/5092",
          "footer": "Automated toll notification"
        },
        "elements": [
          {
            "id": "small_balance",
            "label": "Small unpaid balance",
            "display": "$6.75 unpaid toll balance",
            "is_suspicious": true,
            "explanation": "Small amounts are often used to lower suspicion and make users more willing to enter payment details."
          },
          {
            "id": "penalty_threat",
            "label": "Penalty threat",
            "display": "$39.00 late penalty and registration hold",
            "is_suspicious": true,
            "explanation": "Threats of penalties or account holds create pressure and should be verified through the official toll authority website or app."
          },
          {
            "id": "same_day_pressure",
            "label": "Same-day pressure",
            "display": "Pay today",
            "is_suspicious": true,
            "explanation": "Same-day deadlines are a common social engineering technique to reduce careful verification."
          },
          {
            "id": "generic_payment_link",
            "label": "Generic payment link",
            "display": "toll-pay-us.info",
            "is_suspicious": true,
            "explanation": "The domain is generic and not clearly tied to a legitimate toll agency. Avoid paying through links received by text."
          },
          {
            "id": "automated_notice",
            "label": "Automated notice",
            "display": "Automated toll notification",
            "is_suspicious": false,
            "explanation": "Automated messages can be legitimate. The key risk signals are the link, urgency, payment request, and penalty threat."
          }
        ]
      }
    ]
  },
  "uiText": {
    "es": {
      "app_name": "PhishGuard Trainer",
      "language": "Idioma",
      "hero_kicker": "ENTRENAMIENTO INTERACTIVO CONTRA PHISHING",
      "hero_title": "Aprende a detectar intentos de phishing antes de hacer clic.",
      "hero_subtitle": "Practica con correos, SMS y alertas falsas diseñadas para entrenar tu criterio contra phishing sin exponer datos reales.",
      "phishing_intro_kicker": "Antes de practicar",
      "phishing_intro_title": "¿Qué es el phishing?",
      "phishing_intro_text": "El phishing es un engaño digital en el que alguien intenta hacerse pasar por una persona, empresa o servicio confiable para que reveles información, pagues dinero, descargues archivos peligrosos o hagas clic en enlaces falsos. Puede llegar por correo, SMS, redes sociales, llamadas, códigos QR o mensajes internos de trabajo.",
      "phishing_intro_summary_label": "En pocas palabras",
      "phishing_intro_summary_text": "El atacante no intenta romper la tecnología primero: [[intenta convencerte de hacer algo riesgoso.]]",
      "phishing_intro_steps": [
        "Se presenta como alguien confiable",
        "Te presiona con urgencia o beneficio",
        "Te lleva a un enlace, archivo o respuesta"
      ],
      "phishing_intro_items": [
        {
          "title": "No siempre se ve falso",
          "text": "Un mensaje de phishing puede usar logos, lenguaje formal y datos parciales para parecer legítimo. Por eso conviene revisar el contexto, el remitente, la URL y lo que te están pidiendo."
        },
        {
          "title": "Busca una reacción rápida",
          "text": "Muchos ataques presionan con urgencia, miedo o una recompensa: bloquearán tu cuenta, perderás un pago, debes confirmar ahora o hay una oferta limitada."
        },
        {
          "title": "La defensa es pausar y verificar",
          "text": "Antes de hacer clic, entra manualmente al sitio oficial, contacta por un canal conocido y desconfía de solicitudes de claves, códigos, datos bancarios o documentos."
        }
      ],
      "start_training": "Empezar entrenamiento",
      "phishing_nav": "¿Qué es phishing?",
      "scenarios_nav": "Escenarios",
      "view_scenarios": "Ver escenarios",
      "ethical_purpose": "Aviso legal",
      "github": "GitHub",
      "scenarios_title": "Escenarios de entrenamiento",
      "scenarios_subtitle": "Selecciona un caso, revisa el mensaje simulado y marca las señales que consideres sospechosas.",
      "back_to_scenarios": "Volver a escenarios",
      "select_suspicious": "Marca los elementos sospechosos",
      "select_suspicious_help": "Selecciona todos los elementos que consideres señales de phishing. Algunas opciones pueden ser normales.",
      "view_result": "Ver resultado",
      "result": "Resultado",
      "score": "Puntaje",
      "level": "Nivel",
      "retry": "Reintentar escenario",
      "more_scenarios": "Ver más escenarios",
      "correct": "Detectado correctamente",
      "missed": "Señal omitida",
      "false_positive": "Falso positivo",
      "safe": "Correctamente no marcado",
      "learning_goal": "Objetivo de aprendizaje",
      "how_it_works_kicker": "Cómo practicar",
      "how_it_works_title": "Tres pasos para entrenar tu criterio",
      "how_it_works_steps": [
        {
          "title": "Elige un escenario",
          "text": "Selecciona entre correos y SMS diseñados con señales reales de phishing, organizados por nivel de dificultad."
        },
        {
          "title": "Analiza el mensaje",
          "text": "Lee el contenido con calma, identifica las señales sospechosas y márcalas antes de enviar tu análisis."
        },
        {
          "title": "Aprende del resultado",
          "text": "Recibe retroalimentación inmediata: qué acertaste, qué pasaste por alto y por qué cada señal importa."
        }
      ],
      "common_signals_title": "Señales comunes de phishing",
      "common_signals_intro": "Estas pistas no prueban fraude por sí solas, pero juntas ayudan a decidir cuándo detenerse y verificar.",
      "common_signals": [
        {
          "title": "Urgencia o amenaza",
          "text": "Presionan para actuar de inmediato, pagar, confirmar datos o evitar una supuesta sanción."
        },
        {
          "title": "Remitente extraño",
          "text": "El dominio, número o nombre visible no coincide con la organización que dice escribir."
        },
        {
          "title": "Enlace disfrazado",
          "text": "El texto parece oficial, pero la URL real apunta a otro dominio o usa acortadores."
        },
        {
          "title": "Adjunto inesperado",
          "text": "Archivos no solicitados, comprimidos o documentos que piden habilitar macros o permisos."
        },
        {
          "title": "Datos sensibles",
          "text": "Solicitan contraseñas, códigos MFA, datos bancarios o información personal por un canal no confiable."
        }
      ],
      "resources_title": "Recursos útiles",
      "resources_nav": "Recursos",
      "resources_intro": "Si recibes un correo, SMS o alerta sospechosa, conserva la calma y valida por canales oficiales antes de actuar.",
      "what_to_do_title": "Qué hacer si sospechas phishing",
      "what_to_do_items": [
        "No hagas clic en enlaces, no abras adjuntos y no respondas al mensaje.",
        "Verifica la solicitud entrando manualmente al sitio oficial o llamando a un número conocido, nunca usando los datos del mensaje.",
        "Conserva evidencia: remitente, número, enlaces, capturas, fecha y hora.",
        "Repórtalo al canal oficial correspondiente y bloquea al remitente.",
        "Si ya ingresaste datos, cambia tus contraseñas, activa MFA y contacta a tu banco o proveedor de inmediato."
      ],
      "after_click_title": "Si ya hiciste clic…",
      "after_click_items": [
        "Cierra la página, no ingreses más información y conserva evidencia del enlace o mensaje.",
        "Cambia la contraseña afectada desde el sitio oficial, no desde el enlace del mensaje.",
        "Activa MFA o cambia los métodos de verificación si pudieron quedar expuestos.",
        "Revisa sesiones abiertas, movimientos bancarios y alertas de seguridad.",
        "Reporta el incidente a tu organización, banco o proveedor si involucra cuentas de trabajo o dinero."
      ],
      "report_channels_title": "Dónde reportar",
      "report_channels": [
        {
          "country": "Colombia",
          "items": [
            {
              "label": "CAI Virtual - Policía Nacional",
              "detail": "Denuncias y orientación sobre cibercrimen.",
              "url": "https://caivirtual.policia.gov.co/denuncie"
            },
            {
              "label": "ColCERT",
              "detail": "Reporte de incidentes y phishing: contacto@colcert.gov.co / phishing-report@colcert.gov.co.",
              "url": "https://www.colcert.gov.co/800/w3-article-198656.html"
            }
          ]
        }
      ],
      "ethics_title": "Aviso legal",
      "ethics_text": "Este proyecto es exclusivamente educativo. Es open source, se publica bajo licencia MIT y busca apoyar el entrenamiento defensivo contra phishing. No captura credenciales, no envía correos, no clona marcas reales y no recolecta datos personales. Todos los escenarios son ficticios y pueden ser revisados, adaptados o mejorados por la comunidad.",
      "footer_text": "Proyecto open source para entrenamiento defensivo contra phishing.",
      "not_found": "Escenario no encontrado",
      "difficulty": "Dificultad",
      "type": "Tipo",
      "review_message": "Revisa el mensaje",
      "your_selection": "Tu selección",
      "next_scenario": "Siguiente caso",
      "finish_training": "Finalizar entrenamiento"
    },
    "en": {
      "app_name": "PhishGuard Trainer",
      "language": "Language",
      "hero_kicker": "Interactive phishing defense training",
      "hero_title": "Learn to spot phishing attempts before you click.",
      "hero_subtitle": "Practice with realistic fictional emails, texts, and alerts designed for phishing awareness training without exposing real data.",
      "phishing_intro_kicker": "Before you practice",
      "phishing_intro_title": "What is phishing?",
      "phishing_intro_text": "Phishing is a digital deception where someone pretends to be a trusted person, company, or service so you reveal information, pay money, download dangerous files, or click fake links. It can arrive through email, text messages, social media, phone calls, QR codes, or workplace messages.",
      "phishing_intro_summary_label": "In short",
      "phishing_intro_summary_text": "The attacker does not try to break the technology first: [[they try to convince you to do something risky.]]",
      "phishing_intro_steps": [
        "They pose as someone trusted",
        "They pressure you with urgency or reward",
        "They lead you to a link, file, or reply"
      ],
      "phishing_intro_items": [
        {
          "title": "It does not always look fake",
          "text": "A phishing message may use logos, formal wording, and partial personal details to feel legitimate. That is why it helps to check the context, sender, URL, and request."
        },
        {
          "title": "It tries to rush you",
          "text": "Many attacks create pressure with urgency, fear, or a reward: your account will be blocked, you will miss a payment, you must confirm now, or an offer expires soon."
        },
        {
          "title": "The defense is pause and verify",
          "text": "Before clicking, manually visit the official site, contact through a known channel, and be careful with requests for passwords, codes, banking details, or documents."
        }
      ],
      "start_training": "Start training",
      "phishing_nav": "What is phishing?",
      "scenarios_nav": "Scenarios",
      "view_scenarios": "View scenarios",
      "ethical_purpose": "Disclaimer",
      "github": "GitHub",
      "scenarios_title": "Training scenarios",
      "scenarios_subtitle": "Choose a case, review the simulated message, and select the signals you consider suspicious.",
      "back_to_scenarios": "Back to scenarios",
      "select_suspicious": "Select suspicious elements",
      "select_suspicious_help": "Select all elements you consider phishing signals. Some options may be normal.",
      "view_result": "View result",
      "result": "Result",
      "score": "Score",
      "level": "Level",
      "retry": "Retry scenario",
      "more_scenarios": "More scenarios",
      "correct": "Correctly detected",
      "missed": "Missed signal",
      "false_positive": "False positive",
      "safe": "Correctly not selected",
      "learning_goal": "Learning goal",
      "how_it_works_kicker": "How to practice",
      "how_it_works_title": "Three steps to sharpen your judgment",
      "how_it_works_steps": [
        {
          "title": "Pick a scenario",
          "text": "Choose from emails and SMS messages built with real phishing signals, organized by difficulty level."
        },
        {
          "title": "Analyze the message",
          "text": "Read the content carefully, spot the suspicious signals, and mark them before submitting your analysis."
        },
        {
          "title": "Learn from the result",
          "text": "Get instant feedback: what you caught, what you missed, and why each signal matters."
        }
      ],
      "common_signals_title": "Common phishing signals",
      "common_signals_intro": "These clues do not prove fraud by themselves, but together they help you decide when to stop and verify.",
      "common_signals": [
        {
          "title": "Urgency or threats",
          "text": "They push you to act immediately, pay, confirm details, or avoid a supposed penalty."
        },
        {
          "title": "Unusual sender",
          "text": "The domain, number, or display name does not match the organization claiming to contact you."
        },
        {
          "title": "Disguised link",
          "text": "The text looks official, but the real URL points somewhere else or uses a shortener."
        },
        {
          "title": "Unexpected attachment",
          "text": "Unrequested files, compressed folders, or documents asking you to enable macros or permissions."
        },
        {
          "title": "Sensitive data",
          "text": "They ask for passwords, MFA codes, banking details, or personal information through an untrusted channel."
        }
      ],
      "resources_title": "Useful resources",
      "resources_nav": "Resources",
      "resources_intro": "If you receive a suspicious email, text, or alert, pause and validate it through official channels before taking action.",
      "what_to_do_title": "What to do if you suspect phishing",
      "what_to_do_items": [
        "Do not click links, open attachments, or reply to the message.",
        "Verify the request by manually visiting the official website or calling a trusted number, not the contact details in the message.",
        "Preserve evidence: sender, phone number, links, screenshots, date, and time.",
        "Report it through the appropriate official channel and block the sender.",
        "If you already entered information, change your passwords, enable MFA, and contact your bank or provider immediately."
      ],
      "after_click_title": "If you already clicked…",
      "after_click_items": [
        "Close the page, do not enter more information, and preserve evidence of the link or message.",
        "Change the affected password from the official website, not from the message link.",
        "Enable MFA or change verification methods if they may have been exposed.",
        "Review active sessions, bank activity, and security alerts.",
        "Report the incident to your organization, bank, or provider if it involves work accounts or money."
      ],
      "report_channels_title": "Where to report",
      "report_channels": [
        {
          "country": "United States",
          "items": [
            {
              "label": "FTC ReportFraud.gov",
              "detail": "Report scams and suspicious messages; for SMS you can also forward to 7726.",
              "url": "https://reportfraud.ftc.gov/"
            },
            {
              "label": "FBI IC3",
              "detail": "Report cybercrime, especially if money was lost or accounts were compromised.",
              "url": "https://www.ic3.gov/"
            }
          ]
        }
      ],
      "ethics_title": "Disclaimer",
      "ethics_text": "This project is strictly educational. It is open source, released under the MIT License, and intended to support defensive phishing awareness training. It does not collect credentials, send emails, clone real brands, or collect personal data. All scenarios are fictional and can be reviewed, adapted, or improved by the community.",
      "footer_text": "Open source project for defensive phishing awareness training.",
      "not_found": "Scenario not found",
      "difficulty": "Difficulty",
      "type": "Type",
      "review_message": "Review the message",
      "your_selection": "Your selection",
      "next_scenario": "Next case",
      "finish_training": "Finish training"
    }
  },
  "supportedLangs": [
    "es",
    "en"
  ]
};
