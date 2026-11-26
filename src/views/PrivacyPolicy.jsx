import { Breadcrumb } from '../components/layout/Breadcrumb'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import styles from './Page.module.css'

/**
 * Política de privacidad de AAMorelos.
 */
export function PrivacyPolicy() {
  useDocumentTitle('Política de privacidad')

  return (
    <div className={styles.page}>
      <Breadcrumb
        items={[
          { label: 'Inicio', to: '/' },
          { label: 'Política de privacidad' },
        ]}
      />

      <header className={styles.pageHeader}>
        <span className={styles.eyebrow}>AAMorelos</span>
        <h1 className={styles.title}>Política de privacidad</h1>
        <p className={styles.lead}>
          Última actualización: 25 de noviembre de 2026. Esta política describe cómo
          AAMorelos recopila, usa y protege la información cuando utilizas la aplicación y
          los servicios relacionados.
        </p>
      </header>

      <div className={styles.prose}>
        <div className={styles.infoBox}>
          <p>
            <strong>Resumen:</strong> AAMorelos no vende tu información personal ni muestra
            publicidad de terceros. Solo recopilamos la información necesaria para operar la
            aplicación, responder solicitudes voluntarias y mantener la seguridad del servicio.
          </p>
        </div>

        <h2>1. Responsable</h2>
        <p>
          AAMorelos es operada por AA Morelos / aamorelos.org. Para dudas o solicitudes
          relacionadas con privacidad, puedes escribir a{' '}
          <a href="mailto:aamorelos6todistrito@gmail.com">aamorelos6todistrito@gmail.com</a>.
        </p>

        <h2>2. Información que recopilamos</h2>
        <h3>Información que proporcionas</h3>
        <ul>
          <li>
            <strong>Acceso administrativo:</strong> si usas la sección de Administración, se
            solicitan credenciales (usuario/correo y contraseña) para autenticarte. Estas
            credenciales se envían al servicio de AAMorelos únicamente para validar el acceso.
          </li>
          <li>
            <strong>Autodiagnóstico (opcional):</strong> el autodiagnóstico es orientativo y no
            clínico. Si decides guardar tus respuestas o solicitar que te llamen, la aplicación
            puede enviar las respuestas del cuestionario, la opción de contacto y el número
            telefónico que proporciones, solo con tu acción explícita.
          </li>
        </ul>

        <h3>Información recopilada automáticamente</h3>
        <ul>
          <li>
            <strong>Notificaciones push:</strong> si autorizas notificaciones, la aplicación
            puede usar Firebase Cloud Messaging (Google) para recibir avisos. Esto puede
            implicar el procesamiento de un token de notificación del dispositivo y datos
            técnicos necesarios para entregar la notificación.
          </li>
          <li>
            <strong>Información técnica básica:</strong> el servicio o API puede recibir
            información técnica estándar necesaria para operar, como dirección IP, tipo de
            dispositivo, versión de la app, fecha/hora de solicitud y registros de error, según
            la infraestructura utilizada.
          </li>
        </ul>

        <h2>3. Cómo usamos la información</h2>
        <ul>
          <li>Mostrar contenido de la aplicación: grupos, eventos, reflexiones e información.</li>
          <li>Permitir el acceso administrativo autorizado.</li>
          <li>Procesar el envío voluntario del autodiagnóstico cuando el usuario lo solicita.</li>
          <li>Enviar notificaciones relacionadas con la aplicación, si el usuario las autoriza.</li>
          <li>Mantener la seguridad, funcionamiento y mejora del servicio.</li>
        </ul>

        <h2>4. Compartición de información</h2>
        <p>Podemos compartir información solo en estos casos:</p>
        <ul>
          <li>
            <strong>Proveedores de servicio:</strong> con servicios necesarios para operar la
            aplicación, como infraestructura de alojamiento/API y Firebase Cloud Messaging
            (Google), únicamente para las funciones descritas.
          </li>
          <li>
            <strong>Obligación legal:</strong> cuando sea necesario para cumplir una ley,
            solicitud legal o proteger derechos, seguridad e integridad del servicio.
          </li>
          <li>
            <strong>Con tu consentimiento:</strong> cuando autorices expresamente una acción,
            como solicitar contacto tras el autodiagnóstico.
          </li>
        </ul>

        <h2>5. Retención y seguridad</h2>
        <p>
          Conservamos la información solo el tiempo necesario para los fines descritos en esta
          política o según lo exija la ley. Aplicamos medidas razonables de seguridad para
          proteger la información; sin embargo, ningún sistema de transmisión o almacenamiento
          es 100% seguro.
        </p>

        <h2>6. Permisos de la aplicación</h2>
        <ul>
          <li>
            <strong>Internet:</strong> para consultar y mostrar contenido del servicio AAMorelos.
          </li>
          <li>
            <strong>Notificaciones:</strong> para enviarte avisos relevantes, solo si otorgas
            permiso.
          </li>
        </ul>

        <h2>7. Privacidad de menores</h2>
        <p>
          La aplicación no está dirigida específicamente a menores de 13 años. Si consideras que
          un menor proporcionó información personal sin autorización, contáctanos para revisarlo
          y eliminarla cuando corresponda.
        </p>

        <h2>8. Tus derechos y opciones</h2>
        <ul>
          <li>No otorgar permiso de notificaciones, o desactivarlo desde la configuración de tu dispositivo.</li>
          <li>No enviar el formulario opcional de autodiagnóstico/contacto.</li>
          <li>
            Solicitar información, corrección o eliminación de datos personales que hayas
            proporcionado voluntariamente, escribiendo a{' '}
            <a href="mailto:aamorelos6todistrito@gmail.com">aamorelos6todistrito@gmail.com</a>.
          </li>
        </ul>

        <h2>9. Cambios a esta política</h2>
        <p>
          Podemos actualizar esta Política de Privacidad. Publicaremos la versión vigente en
          esta misma URL e indicaremos la fecha de última actualización.
        </p>
      </div>
    </div>
  )
}
