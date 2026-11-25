import { Breadcrumb } from '../components/layout/Breadcrumb'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import styles from './Page.module.css'

/**
 * PolÃ­tica de privacidad de AAMorelos.
 */
export function PrivacyPolicy() {
  useDocumentTitle('PolÃ­tica de privacidad')

  return (
    <div className={styles.page}>
      <Breadcrumb
        items={[
          { label: 'Inicio', to: '/' },
          { label: 'PolÃ­tica de privacidad' },
        ]}
      />

      <header className={styles.pageHeader}>
        <span className={styles.eyebrow}>AAMorelos</span>
        <h1 className={styles.title}>PolÃ­tica de privacidad</h1>
        <p className={styles.lead}>
          Ãšltima actualizaciÃ³n: 25 de noviembre de 2026. Esta polÃ­tica describe cÃ³mo
          AAMorelos recopila, usa y protege la informaciÃ³n cuando utilizas la aplicaciÃ³n y
          los servicios relacionados.
        </p>
      </header>

      <div className={styles.prose}>
        <div className={styles.infoBox}>
          <p>
            <strong>Resumen:</strong> AAMorelos no vende tu informaciÃ³n personal ni muestra
            publicidad de terceros. Solo recopilamos la informaciÃ³n necesaria para operar la
            aplicaciÃ³n, responder solicitudes voluntarias y mantener la seguridad del servicio.
          </p>
        </div>

        <h2>1. Responsable</h2>
        <p>
          AAMorelos es operada por AA Morelos / aamorelos.org. Para dudas o solicitudes
          relacionadas con privacidad, puedes escribir a{' '}
          <a href="mailto:aamorelos6todistrito@gmail.com">aamorelos6todistrito@gmail.com</a>.
        </p>

        <h2>2. InformaciÃ³n que recopilamos</h2>
        <h3>InformaciÃ³n que proporcionas</h3>
        <ul>
          <li>
            <strong>Acceso administrativo:</strong> si usas la secciÃ³n de AdministraciÃ³n, se
            solicitan credenciales (usuario/correo y contraseÃ±a) para autenticarte. Estas
            credenciales se envÃ­an al servicio de AAMorelos Ãºnicamente para validar el acceso.
          </li>
          <li>
            <strong>AutodiagnÃ³stico (opcional):</strong> el autodiagnÃ³stico es orientativo y no
            clÃ­nico. Si decides guardar tus respuestas o solicitar que te llamen, la aplicaciÃ³n
            puede enviar las respuestas del cuestionario, la opciÃ³n de contacto y el nÃºmero
            telefÃ³nico que proporciones, solo con tu acciÃ³n explÃ­cita.
          </li>
        </ul>

        <h3>InformaciÃ³n recopilada automÃ¡ticamente</h3>
        <ul>
          <li>
            <strong>Notificaciones push:</strong> si autorizas notificaciones, la aplicaciÃ³n
            puede usar Firebase Cloud Messaging (Google) para recibir avisos. Esto puede
            implicar el procesamiento de un token de notificaciÃ³n del dispositivo y datos
            tÃ©cnicos necesarios para entregar la notificaciÃ³n.
          </li>
          <li>
            <strong>InformaciÃ³n tÃ©cnica bÃ¡sica:</strong> el servicio o API puede recibir
            informaciÃ³n tÃ©cnica estÃ¡ndar necesaria para operar, como direcciÃ³n IP, tipo de
            dispositivo, versiÃ³n de la app, fecha/hora de solicitud y registros de error, segÃºn
            la infraestructura utilizada.
          </li>
        </ul>

        <h2>3. CÃ³mo usamos la informaciÃ³n</h2>
        <ul>
          <li>Mostrar contenido de la aplicaciÃ³n: grupos, eventos, reflexiones e informaciÃ³n.</li>
          <li>Permitir el acceso administrativo autorizado.</li>
          <li>Procesar el envÃ­o voluntario del autodiagnÃ³stico cuando el usuario lo solicita.</li>
          <li>Enviar notificaciones relacionadas con la aplicaciÃ³n, si el usuario las autoriza.</li>
          <li>Mantener la seguridad, funcionamiento y mejora del servicio.</li>
        </ul>

        <h2>4. ComparticiÃ³n de informaciÃ³n</h2>
        <p>Podemos compartir informaciÃ³n solo en estos casos:</p>
        <ul>
          <li>
            <strong>Proveedores de servicio:</strong> con servicios necesarios para operar la
            aplicaciÃ³n, como infraestructura de alojamiento/API y Firebase Cloud Messaging
            (Google), Ãºnicamente para las funciones descritas.
          </li>
          <li>
            <strong>ObligaciÃ³n legal:</strong> cuando sea necesario para cumplir una ley,
            solicitud legal o proteger derechos, seguridad e integridad del servicio.
          </li>
          <li>
            <strong>Con tu consentimiento:</strong> cuando autorices expresamente una acciÃ³n,
            como solicitar contacto tras el autodiagnÃ³stico.
          </li>
        </ul>

        <h2>5. RetenciÃ³n y seguridad</h2>
        <p>
          Conservamos la informaciÃ³n solo el tiempo necesario para los fines descritos en esta
          polÃ­tica o segÃºn lo exija la ley. Aplicamos medidas razonables de seguridad para
          proteger la informaciÃ³n; sin embargo, ningÃºn sistema de transmisiÃ³n o almacenamiento
          es 100% seguro.
        </p>

        <h2>6. Permisos de la aplicaciÃ³n</h2>
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
          La aplicaciÃ³n no estÃ¡ dirigida especÃ­ficamente a menores de 13 aÃ±os. Si consideras que
          un menor proporcionÃ³ informaciÃ³n personal sin autorizaciÃ³n, contÃ¡ctanos para revisarlo
          y eliminarla cuando corresponda.
        </p>

        <h2>8. Tus derechos y opciones</h2>
        <ul>
          <li>No otorgar permiso de notificaciones, o desactivarlo desde la configuraciÃ³n de tu dispositivo.</li>
          <li>No enviar el formulario opcional de autodiagnÃ³stico/contacto.</li>
          <li>
            Solicitar informaciÃ³n, correcciÃ³n o eliminaciÃ³n de datos personales que hayas
            proporcionado voluntariamente, escribiendo a{' '}
            <a href="mailto:aamorelos6todistrito@gmail.com">aamorelos6todistrito@gmail.com</a>.
          </li>
        </ul>

        <h2>9. Cambios a esta polÃ­tica</h2>
        <p>
          Podemos actualizar esta PolÃ­tica de Privacidad. Publicaremos la versiÃ³n vigente en
          esta misma URL e indicaremos la fecha de Ãºltima actualizaciÃ³n.
        </p>
      </div>
    </div>
  )
}
