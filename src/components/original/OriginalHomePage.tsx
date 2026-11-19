import Image from "next/image";
import Link from "next/link";

const chapters = [
  "OBS",
  "ORL",
  "NEU",
  "PSY",
  "CAR",
  "PNE",
  "HÉP",
  "GAS",
  "NÉP",
  "GYN",
  "ORT",
  "RHU",
  "END",
  "S-MÉ",
  "PÉD",
  "DER",
  "MIN",
  "CAN",
  "USP",
  "RÉT",
  "SPU",
  "THÉ",
  "NUT",
  "EPI",
];

export function OriginalHomePage() {
  return (
    <main className="original-home">
      <section className="original-home__column original-home__intro">
        <p>
          Devenir un interne sous-alimenté puis un médecin assigné en justice
          n&apos;est pas facile ; il faut d&apos;abord une dure préparation
        </p>
        <p>
          Synthèse méthodique du programme des EDN, le MIKBOOK propose aux
          étudiants un outil de mémorisation visuelle et logique des points
          essentiels, s&apos;appuyant sur un graphisme particulier : un code de
          couleurs identique pour chaque item de chaque chapitre, visant à un
          projet pédagogique global.
        </p>
        <p className="original-home__cta">
          Read the Mikbook
          <br />
          or just play with it.
        </p>
        <address className="original-home__contacts">
          <span>E-mail : @mikbook.com</span>
          <span>Editions Eyrolles (publisher)</span>
          <span>1 rue Thénard</span>
          <span>75005 Paris</span>
          <a href="https://www.instagram.com/">Follow us on Instagram</a>
        </address>
      </section>

      <section className="original-home__column original-home__middle">
        <h2 className="original-home__section-title" id="chapitres">
          CHAPITRES
        </h2>
        <nav className="original-chapters" aria-label="Chapters">
          {chapters.map((chapter, index) => {
            const number = index + 1;
            const label = `(${number}) ${chapter}`;
            return (
              <Link key={chapter} href={`/original/chapters/${number}`}>
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="original-home__gallery" aria-label="Photos">
          <Image
            className="original-photo original-photo--right original-photo--column-2-1"
            src="/landing/img-02.jpg"
            alt="Alarme incendie rouge"
            width={800}
            height={1200}
            sizes="(max-width: 759px) 90vw, 27vw"
          />
          <Image
            className="original-photo original-photo--right original-photo--column-2-2"
            src="/landing/img-03.jpg"
            alt=""
            width={800}
            height={1200}
            sizes="(max-width: 759px) 90vw, 27vw"
          />
          <Image
            className="original-photo original-photo--right original-photo--column-2-3"
            src="/landing/img-04.jpg"
            alt=""
            width={800}
            height={1200}
            sizes="(max-width: 759px) 90vw, 27vw"
          />
        </div>
      </section>

      <section className="original-home__column original-home__right" aria-label="Photos">
        <Image
          className="original-photo original-photo--escalator"
          src="/landing/img-01.jpg"
          alt="Escalator"
          width={800}
          height={1200}
          priority
          sizes="(max-width: 759px) 100vw, 39vw"
        />
        <Image
          className="original-photo original-photo--floating-1"
          src="/landing/img-05.jpg"
          alt=""
          width={800}
          height={1200}
          sizes="(max-width: 759px) 90vw, 28vw"
        />
        <Image
          className="original-photo original-photo--floating-2"
          src="/landing/img-06.jpg"
          alt=""
          width={800}
          height={1200}
          sizes="(max-width: 759px) 90vw, 24vw"
        />
        <Image
          className="original-photo original-photo--floating-3"
          src="/landing/img-07.jpg"
          alt=""
          width={800}
          height={1200}
          sizes="(max-width: 759px) 90vw, 30vw"
        />
        <Image
          className="original-photo original-photo--floating-2"
          src="/landing/img-08.jpg"
          alt=""
          width={800}
          height={1200}
          sizes="(max-width: 759px) 90vw, 24vw"
        />
      </section>
    </main>
  );
}
