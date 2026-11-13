import { useEffect, useRef, useState } from 'react';
import styles from './FullScreenImage.module.css';

/**
 * Imagen ampliable a pantalla completa.
 *
 * Uso: <FullScreenImage src={...} alt={...} onError={...} />
 * El <img> admite las mismas props que un <img> normal (onLoad, onError, className…).
 * Al activarla se abre un visor modal: clic fuera, Escape o el botón × la cierran.
 */
export default function FullScreenImage({ src, alt = '', ...imgProps }) {
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      triggerRef.current?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        ref={triggerRef}
        className={styles.trigger}
        onClick={() => setOpen(true)}
        title="Ver a pantalla completa"
        aria-label="Ampliar imagen a pantalla completa"
      >
        <img src={src} alt={alt} loading="lazy" {...imgProps} />
      </button>

      {open ? (
        <div
          className={styles.overlay}
          role="presentation"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            ref={closeButtonRef}
            className={styles.close}
            onClick={() => setOpen(false)}
            aria-label="Cerrar"
          >
            ×
          </button>
          <img
            src={src}
            alt={alt}
            className={styles.image}
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      ) : null}
    </>
  );
}
