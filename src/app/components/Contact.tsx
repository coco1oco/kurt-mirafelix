import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, Mail, User, MessageSquare } from 'lucide-react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

// ─── EmailJS config ──────────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID = 'service_a5azasm';
const EMAILJS_TEMPLATE_ID = 'template_uvk425n';
const EMAILJS_PUBLIC_KEY = '4X5IZ_5tdgbxu5HEN';
// ─────────────────────────────────────────────────────────────────────────────

type Status = 'idle' | 'sending' | 'success' | 'error' | 'rate_limited';

interface FormState {
  name: string;
  email: string;
  message: string;
}

const INITIAL: FormState = { name: '', email: '', message: '' };

const sanitize = (str: string) => {
  // Remove HTML tags and trim whitespace
  return str.replace(/<[^>]*>?/gm, '').trim();
};

function InputField({
  id,
  label,
  icon: Icon,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  disabled,
  maxLength,
}: {
  id: string;
  label: string;
  icon: typeof User;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 tracking-wide"
      >
        <Icon className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" strokeWidth={1.5} />
        {label}
      </label>
      <div className={`relative border transition-colors duration-200 ${focused
        ? 'border-gray-900 dark:border-gray-400'
        : 'border-gray-200 dark:border-gray-700'
        } ${disabled ? 'opacity-50' : ''}`}>
        <input
          id={id}
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          maxLength={maxLength}
          className="w-full bg-transparent px-4 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 outline-none transition-colors duration-200"
        />
        {/* Focus accent line */}
        <motion.div
          className="absolute bottom-0 left-0 h-px bg-gray-900 dark:bg-gray-400"
          animate={{ scaleX: focused ? 1 : 0 }}
          initial={{ scaleX: 0 }}
          style={{ originX: 0 }}
          transition={{ duration: 0.2 }}
        />
      </div>
    </div>
  );
}

export function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const reduceMotion = usePrefersReducedMotion();

  const [form, setForm] = useState<FormState>(INITIAL);
  const [status, setStatus] = useState<Status>('idle');
  const [focused, setFocused] = useState(false);
  const [validationError, setValidationError] = useState<string>('');

  const set = (field: keyof FormState) => (value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (validationError) setValidationError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;

    setValidationError('');

    const sanitizedName = sanitize(form.name);
    const sanitizedEmail = sanitize(form.email);
    const sanitizedMessage = sanitize(form.message);

    if (sanitizedName.length < 2) {
      setValidationError('Name must be at least 2 characters long.');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    if (sanitizedMessage.length < 10) {
      setValidationError('Message must be at least 10 characters long.');
      return;
    }

    // Rate limiting check: 60 seconds cooldown
    const lastSentStr = localStorage.getItem('last_contact_sent');
    if (lastSentStr) {
      const lastSent = parseInt(lastSentStr, 10);
      if (Date.now() - lastSent < 60000) {
        setStatus('rate_limited');
        setTimeout(() => setStatus('idle'), 5000);
        return;
      }
    }

    setStatus('sending');

    try {
      // Dynamically import emailjs to keep bundle lean
      const emailjs = await import('@emailjs/browser');
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          name: sanitizedName,
          email: sanitizedEmail,
          message: sanitizedMessage,
          reply_to: sanitizedEmail,
          time: new Date().toLocaleString('en-PH', {
            timeZone: 'Asia/Manila',
            dateStyle: 'long',
            timeStyle: 'short',
          }),
        },
        { publicKey: EMAILJS_PUBLIC_KEY }
      );
      localStorage.setItem('last_contact_sent', Date.now().toString());
      setStatus('success');
      setForm(INITIAL);
    } catch (err) {
      console.error('EmailJS error:', err);
      setStatus('error');
    }

    // Reset to idle after 5 s
    setTimeout(() => setStatus('idle'), 5000);
  };

  const isDisabled = status === 'sending' || status === 'success';

  return (
    <section
      id="contact"
      ref={ref}
      className="relative py-32 px-6 bg-gray-50 dark:bg-gray-900 overflow-hidden transition-colors duration-300"
    >
      {/* Geometric accent */}
      <motion.div
        className="absolute top-20 left-20 w-[400px] h-[400px] border border-gray-200 dark:border-gray-800 rounded-full pointer-events-none"
        style={{ opacity: 0.4 }}
        animate={reduceMotion ? undefined : { scale: [1, 1.04, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="mb-16 space-y-4"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-px bg-gray-900 dark:bg-gray-400" />
            <span className="text-sm font-medium tracking-widest text-gray-400 dark:text-gray-500 uppercase">
              Get In Touch
            </span>
          </div>
          <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Contact
          </h2>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid md:grid-cols-2 gap-16 items-start">

          {/* Left — copy */}
          <motion.div
            className="space-y-8"
            initial={reduceMotion ? false : { opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="space-y-4 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>
                Whether you're looking to collaborate on a project, discuss a role, or just want to
                say hello — my inbox is always open.
              </p>
              <p>
                I'll do my best to get back to you within 24 hours.
              </p>
            </div>

            {/* Contact details */}
            <div className="space-y-4 pt-4">
              {[
                { label: 'Email', value: 'kmirafelix@gmail.com', href: 'mailto:kmirafelix@gmail.com' },
                { label: 'LinkedIn', value: 'kurt-michael-mirafelix', href: 'https://www.linkedin.com/in/kurt-michael-mirafelix' },
                { label: 'GitHub', value: 'coco1oco', href: 'https://github.com/coco1oco' },
              ].map(({ label, value, href }) => (
                <motion.a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-4 group"
                  whileHover={{ x: 6 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <div className="w-8 h-px bg-gray-300 dark:bg-gray-700 group-hover:bg-gray-900 dark:group-hover:bg-gray-400 transition-colors duration-200" />
                  <div>
                    <p className="text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      {label}
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-200 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors duration-200">
                      {value}
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <form
              onSubmit={handleSubmit}
              className="relative bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 p-8 space-y-6 transition-colors duration-300"
              noValidate
            >
              {/* Hover accent line */}
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gray-900 dark:bg-gray-400 origin-left scale-x-0 hover:scale-x-100 transition-transform duration-500" />

              <InputField
                id="contact-name"
                label="Name"
                icon={User}
                value={form.name}
                onChange={set('name')}
                placeholder="Kurt Michael Mirafelix"
                required
                disabled={isDisabled}
                maxLength={100}
              />

              <InputField
                id="contact-email"
                label="Email"
                icon={Mail}
                type="email"
                value={form.email}
                onChange={set('email')}
                placeholder="you@example.com"
                required
                disabled={isDisabled}
                maxLength={150}
              />

              {/* Textarea */}
              <div className="space-y-2">
                <label
                  htmlFor="contact-message"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 tracking-wide"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" strokeWidth={1.5} />
                  Message
                </label>
                <div className={`relative border transition-colors duration-200 ${focused
                  ? 'border-gray-900 dark:border-gray-400'
                  : 'border-gray-200 dark:border-gray-700'
                  } ${isDisabled ? 'opacity-50' : ''}`}>
                  <textarea
                    id="contact-message"
                    rows={5}
                    value={form.message}
                    onChange={e => set('message')(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder="I'd love to discuss..."
                    required
                    disabled={isDisabled}
                    maxLength={2000}
                    className="w-full resize-none bg-transparent px-4 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 outline-none transition-colors duration-200"
                  />
                  <motion.div
                    className="absolute bottom-0 left-0 h-px bg-gray-900 dark:bg-gray-400"
                    animate={{ scaleX: focused ? 1 : 0 }}
                    initial={{ scaleX: 0 }}
                    style={{ originX: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              </div>

              {/* Submit button */}
              <motion.button
                type="submit"
                disabled={isDisabled}
                className={`w-full flex items-center justify-center gap-3 px-8 py-4 font-medium text-sm tracking-wide transition-all duration-300 ${status === 'success'
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-default'
                  : 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-300'
                  } disabled:cursor-not-allowed`}
                whileHover={isDisabled ? {} : { scale: 1.01 }}
                whileTap={isDisabled ? {} : { scale: 0.99 }}
              >
                {status === 'idle' && (
                  <>
                    <Send className="w-4 h-4" strokeWidth={1.5} />
                    Send Message
                  </>
                )}
                {status === 'sending' && (
                  <>
                    <motion.div
                      className="w-4 h-4 border-2 border-white dark:border-gray-900 border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    />
                    Sending…
                  </>
                )}
                {status === 'success' && (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" strokeWidth={1.5} />
                    Message Sent!
                  </>
                )}
                {status === 'error' && (
                  <>
                    <AlertCircle className="w-4 h-4 text-red-500" strokeWidth={1.5} />
                    Failed — Try Again
                  </>
                )}
              </motion.button>

              {/* Status message */}
              {validationError && (
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-xs text-red-500"
                >
                  {validationError}
                </motion.p>
              )}
              {status === 'success' && (
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-xs text-gray-500 dark:text-gray-400"
                >
                  Thanks! I'll get back to you within 24 hours.
                </motion.p>
              )}
              {status === 'error' && (
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-xs text-red-500"
                >
                  Something went wrong. You can also email me directly at kmirafelix@gmail.com
                </motion.p>
              )}
              {status === 'rate_limited' && (
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-xs text-orange-500 dark:text-orange-400"
                >
                  Please wait a minute before sending another message.
                </motion.p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
