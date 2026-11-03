import Breadcrumb from '../components/layout/Breadcrumb'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { site } from '../data/site'
import styles from './Page.module.css'

const notDone = [
  'No da a los alcohólicos la motivación para recuperarse.',
  'No trata de persuadir a los alcohólicos para que se hagan miembros.',
  'No patrocina ni participa en investigaciones.',
  'No guarda registros de asistencia ni historiales.',
  'No está afiliada a consejos ni agencias sociales.',
  'No vigila ni trata de controlar a sus miembros.',
  'No hace pronósticos ni diagnósticos médicos ni psicológicos.',
  'No provee servicios de desintoxicación ni de enfermería y hospitalización, medicinas o cualquier tratamiento médico psiquiátrico.',
  'No ofrece servicios religiosos ni organiza ni patrocina retiros.',
  'No participa en la educación acerca del alcohol.',
  'No proporciona servicios de vivienda, alimentación, ropa, dinero, trabajo, ni demás servicios de asistencia social.',
  'No ofrece servicios de consulta doméstica ni profesional.',
  'No acepta dinero por sus servicios, ni contribuciones de fuentes no A.A.',
  'No suministra cartas de recomendación a las juntas de libertad condicional, abogados o funcionarios de los tribunales, agencias sociales, empleadores.',
]

export default function Info() {
  useDocumentTitle('¿Qué es AA?')

  return (
    <div className={styles.page}>
      <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: '¿Qué es AA?' }]} />

      <header className={styles.pageHeader}>
        <span className={styles.eyebrow}>Alcohólicos Anónimos</span>
        <h1 className={styles.title}>¿Qué es AA?</h1>
        <p className={styles.lead}>
          Alcohólicos Anónimos® es una comunidad de hombres y mujeres que comparten su mutua
          experiencia, fortaleza y esperanza para resolver su problema común y ayudar a otros a
          recuperarse del alcoholismo.
        </p>
      </header>

      <div className={styles.prose}>
        <div className={styles.infoBox}>
          <p><strong>Principios y requisitos fundamentales:</strong></p>
          <ul>
            <li>El único requisito para ser miembro de AA es el deseo de dejar la bebida.</li>
            <li>Para ser miembro de AA no se pagan honorarios ni cuotas; nos mantenemos con nuestras propias contribuciones.</li>
            <li>AA no está afiliada a ninguna secta, religión, partido político, organización o institución alguna; no desea intervenir en controversias, no respalda ni se opone a ninguna causa.</li>
          </ul>
        </div>

        <h2>Historia de AA</h2>
        <p>
          Alcohólicos Anónimos nace un 10 de junio de 1935 en la ciudad de Akron, Ohio, en los
          Estados Unidos de América, cuando dos alcohólicos crónicos: el Dr. Robert H. Smith
          (Bob S.) y William Griffith Wilson (Bill W.) —cofundadores— se encuentran y, a través
          del compartimiento de sus experiencias como bebedores problema, alcanzan el estado de
          sobriedad permanente. El éxito de este resultado se basa en la idea de que un alcohólico
          puede ayudar a otro alcohólico a través de un “puente de comprensión”.
        </p>
        <p>
          Ésta es la fecha en que oficialmente se funda Alcohólicos Anónimos y a partir de la cual
          comienza a desarrollarse el revolucionario y exitoso programa de los “Doce Pasos de A.A.”
          que ayuda a los alcohólicos a mantenerse en sobriedad. El nombre de A.A. es tomado de la
          primera publicación del libro “Alcohólicos Anónimos” en el año de 1939, escrito por Bill W.
        </p>
        <p>
          Nuestro objetivo primordial es mantenernos sobrios y ayudar a otros alcohólicos a alcanzar
          el estado de sobriedad.
        </p>

        <h2>¿Qué es el alcoholismo?</h2>
        <p>
          Hay diversas y muy distintas interpretaciones del alcoholismo. La explicación que parece
          más sensata a la mayoría de los miembros de A.A. es que el alcoholismo es una enfermedad,
          una enfermedad progresiva que no puede curarse pero que, al igual que muchas otras
          enfermedades, puede contenerse.
        </p>
        <p>
          Antes de haber sentido la influencia de A.A., muchos alcohólicos que no pueden dejar de
          beber se consideran moralmente débiles o, en algunos casos, se sienten víctimas de algún
          desequilibrio mental. A.A. cree que los alcohólicos son más bien enfermos que pueden
          mejorar de su dolencia siguiendo un programa sencillo y que ha resultado eficaz para más
          de 2 millones de hombres y mujeres.
        </p>
        <p>
          Una vez que el alcoholismo se ha apoderado de un individuo, no puede decirse que la
          víctima esté cometiendo una falta moral. En ese estado, el alcohólico no puede valerse de
          su fuerza de voluntad, porque ya ha perdido la facultad de decidir si usa el alcohol o si
          se abstiene de él.
        </p>
        <p>
          Lo importante, entonces, es hacerle frente a la enfermedad y valerse de la ayuda que se le
          brinda para combatirla. Debe además existir el deseo sincero de recuperarse. La experiencia
          ha demostrado que el programa de A.A. resulta eficaz para cualquier alcohólico que tenga
          sinceros deseos de dejar la bebida; generalmente no produce resultados para el hombre o
          mujer que no esté absolutamente seguro de querer dejar el alcohol.
        </p>

        <h2>¿Cómo funciona Alcohólicos Anónimos?</h2>
        <p>
          Los miembros hacen uso de su programa de recuperación, los “Doce Pasos de A.A.”, para
          mantener la sobriedad, mediante un conjunto de principios espirituales que, cuando se
          practican como una forma de vida, pueden eliminar la obsesión por beber.
        </p>
        <p>
          Los grupos usan las “Doce Tradiciones” para permanecer unidos. En este sentido destaca la
          unicidad de propósito que resulta esencial para el tratamiento eficaz del alcoholismo y la
          tercera tradición que a la letra dice: <em>“El único requisito para ser miembro de A.A. es querer dejar de beber”</em>.
        </p>
        <p>
          Es decir, sólo aquellos que sufren de adicción al alcohol podrán integrarse a Alcohólicos
          Anónimos®. La experiencia ha demostrado que las personas con otro tipo de adicciones no
          logran establecer un puente de comprensión, lo que impide experimentar un verdadero
          sentido espiritual de pertenencia, fundamental en el proceso de recuperación.
        </p>
        <p>
          Los grupos de Alcohólicos Anónimos® funcionan a través de sesiones en terapia grupal de
          ayuda mutua; la asistencia es voluntaria y sus servicios son gratuitos.
        </p>
        <p>
          En México todos los grupos integrantes de los Servicios Mundiales de Alcohólicos Anónimos®
          registran su grupo en la Oficina de Servicios Generales (OSG) y cuentan con una placa de
          identidad.
        </p>

        <h2>¿Cómo ingreso a un grupo?</h2>
        <p>
          Sólo dirígete al grupo más cercano a tu domicilio, verifica la hora y días de sesión, y
          preséntate mencionando que deseas información para dejar de beber. Si es para algún
          familiar, menciona que deseas información sobre AA para un ser querido o amigo. También,
          si gustas, puedes llamarnos al <strong>{site.nationalPhone}</strong> (horario de oficina)
          y con gusto te brindaremos asesoría.
        </p>
        <p>
          Aclaramos aquí que los grupos originales de Alcohólicos Anónimos en México se conocen como
          grupos de Central Mexicana y, como tales, cada uno de ellos tiene una placa de
          reconocimiento que los identifica como pertenecientes a este movimiento. También,
          coloquialmente, se les denomina grupos tradicionales o grupos de hora y media.
        </p>
        <p>
          En esta misma página puedes buscar un grupo en el directorio del Área Morelos. También
          puedes comunicarte con nosotros al <strong>{site.phone}</strong> o escribir a{' '}
          <a href={`mailto:${site.email}`}>{site.email}</a> para recibir orientación sobre grupos,
          direcciones y horarios.
        </p>

        <h2>¿Qué es lo que AA no hace?</h2>
        <div className={styles.infoBox}>
          <ul>
            {notDone.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <h2>¿Qué es la Central Mexicana de Servicios Generales de AA?</h2>
        <p>
          La Central Mexicana de Servicios Generales de Alcohólicos Anónimos, de acuerdo con su acta
          constitutiva, es una Asociación Civil no lucrativa integrada actualmente por la Oficina de
          Servicios Generales y la Oficina Plenitud AA. Tiene como objetivo prestar servicios y
          llevar a cabo actividades para ayudar a la recuperación de las personas que padecen la
          enfermedad del alcoholismo a través del programa de Alcohólicos Anónimos®, así como
          imprimir y distribuir la literatura de AA, y es la única poseedora de los derechos de autor
          en nuestro país.
        </p>
        <p>
          En México la única representación legal de los Servicios Mundiales de Alcohólicos Anónimos,
          reconocida por Alcoholics Anonymous World Services, Inc., con sede en la ciudad de Nueva
          York, es la Central Mexicana de Servicios Generales de Alcohólicos Anónimos, A.C., con sede
          en la Ciudad de México. Cuenta con una gran variedad de libros y folletos que coadyuvan a
          la recuperación del enfermo alcohólico y es la única autorizada para publicar y distribuir
          dicha literatura en México.
        </p>

        <p>
          Fuentes oficiales:{' '}
          <a href="https://www.aamexico.org" target="_blank" rel="noopener noreferrer">www.aamexico.org</a>
          {' | '}
          <a href="https://www.aa.org" target="_blank" rel="noopener noreferrer">www.aa.org</a>
        </p>
      </div>

      <div className={styles.ctaRow}>
        <a className={styles.primaryButton} href={`tel:${site.phoneHref}`}>
          Llamar al {site.phone}
        </a>
        <a className={styles.secondaryButton} href={`mailto:${site.email}`}>
          Escribir un correo
        </a>
      </div>
    </div>
  )
}
