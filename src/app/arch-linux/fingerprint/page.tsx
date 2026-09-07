"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { CheatsheetCommandCard } from "@/components/CheatsheetCommandCard";

export default function FingerprintPage() {
  const { lang } = useLanguage();

  // ── Blocs multi-lignes ──────────────────────────────────────────────────────
  const pkgbuild =
`pkgname=libfprint-elanpress-pr1-git
_pkgname=libfprint
pkgver=1.94.10
pkgrel=1
pkgdesc="libfprint, driver elanpress pour ELAN 04f3:0c6e"
url="https://github.com/Quoteme/libfprint"
arch=(x86_64)
license=(LGPL-2.1-or-later)
depends=(libgusb pixman nss systemd libgudev glib2)
makedepends=(git meson gobject-introspection glib2-devel)
provides=(libfprint libfprint-2.so)
conflicts=(libfprint libfprint-elanpress-git)
source=("git+https://github.com/Quoteme/libfprint.git#branch=elanpress")
sha256sums=('SKIP')

pkgver() {
  cd "$_pkgname"
  local d
  d=$(git describe --long --tags 2>/dev/null | sed 's/^v//;s/\\([^-]*-g\\)/r\\1/;s/-/./g')
  if [[ -n "$d" ]]; then
    printf '%s\\n' "$d"
  else
    printf '1.94.10.r%s.g%s\\n' "$(git rev-list --count HEAD)" "$(git rev-parse --short HEAD)"
  fi
}

build() {
  arch-meson "$_pkgname" build -Ddoc=false
  meson compile -C build
}

package() {
  meson install -C build --destdir "$pkgdir"
}`;

  const udevRule =
`sudo tee /etc/udev/rules.d/99-fingerprint-nosuspend.rules <<'RULE'
ACTION=="add|change", SUBSYSTEM=="usb", ATTR{idVendor}=="04f3", \\
  ATTR{idProduct}=="0c6e", TEST=="power/control", ATTR{power/control}="on"
RULE
sudo udevadm control --reload-rules
sudo udevadm trigger --action=change --subsystem-match=usb`;

  const pamLine =
`# En tete de la pile auth de /etc/pam.d/{sudo,polkit-1,sddm} :
auth       sufficient                  pam_fprintd.so`;

  const resumeUnit =
`# /etc/systemd/system/fprintd-resume.service
[Unit]
Description=Libere le lecteur d'empreintes apres une sortie de veille
After=suspend.target hibernate.target hybrid-sleep.target

[Service]
Type=oneshot
ExecStart=/usr/bin/systemctl stop fprintd.service

[Install]
WantedBy=suspend.target hibernate.target hybrid-sleep.target`;

  const debugRun =
`sudo systemctl stop fprintd
sudo G_MESSAGES_DEBUG=all /usr/lib/fprintd -t 120 > /tmp/fprintd.log 2>&1 &
fprintd-enroll -f right-index-finger
grep -iE "elanpress|finger|touch|background" /tmp/fprintd.log`;

  // ── Sections ────────────────────────────────────────────────────────────────
  const sections = [
    {
      id: "driver",
      title: lang === "fr" ? "Le bon driver" : "The right driver",
      note: lang === "fr"
        ? "Le libfprint officiel reconnait ce capteur mais ne le fera jamais marcher"
        : "Official libfprint recognises this sensor but will never make it work",
      entries: [
        {
          cmd: "lsusb | grep -i fingerprint",
          why: lang === "fr"
            ? "Identifie le capteur. Sur le ROG Flow X13 c'est un 04f3:0c6e. Le libfprint officiel le confie a son driver elan, prevu pour les capteurs a image, alors que celui-ci est un capteur press-type. Resultat : detecte, mais l'enrolement echoue toujours sur Calibration failed!"
            : "Identifies the sensor. On the ROG Flow X13 it is a 04f3:0c6e. Official libfprint hands it to its elan driver, meant for image sensors, while this one is a press-type sensor. Result: detected, but enrollment always dies on Calibration failed!",
        },
        {
          cmd: "journalctl -u fprintd -n 50",
          why: lang === "fr"
            ? "Les deux signatures du mauvais driver : Calibration failed! et Internal state machine issue: transition from AWAIT_FINGER_ON to AWAIT_FINGER_OFF should not happen!"
            : "The two signatures of the wrong driver: Calibration failed! and Internal state machine issue: transition from AWAIT_FINGER_ON to AWAIT_FINGER_OFF should not happen!",
        },
      ],
    },
    {
      id: "install",
      title: lang === "fr" ? "Installation" : "Install",
      note: lang === "fr"
        ? "Attention : deux forks existent, un seul fonctionne vraiment"
        : "Careful: two forks exist, only one actually works",
      entries: [
        {
          cmd: "sudo pacman -S --needed fprintd",
          why: lang === "fr"
            ? "Le demon reste celui des depots officiels. Seul libfprint sera remplace."
            : "The daemon stays the one from official repos. Only libfprint gets replaced.",
        },
        {
          cmd: pkgbuild,
          why: lang === "fr"
            ? "A coller dans un dossier vide sous le nom PKGBUILD, puis makepkg -si. J'utilise la branche du PR de Quoteme, pas le paquet AUR libfprint-elanpress-git : ce dernier attend que le capteur rapporte l'etat 0xcc, que ce modele n'envoie qu'une seule fois par demarrage. Resultat, il enrole une fois puis n'a plus jamais rien detecte. La branche du PR lit l'image et detecte elle-meme la presence du doigt. Le repli dans pkgver() est indispensable : le fork est clone sans tags, git describe ne renvoie rien et makepkg refuse une version vide."
            : "Drop this into an empty folder as PKGBUILD, then makepkg -si. I use Quoteme's PR branch, not the AUR package libfprint-elanpress-git: that one waits for the sensor to report state 0xcc, which this model only sends once per boot. So it enrolls once and then never detects anything again. The PR branch reads the image and detects the finger itself. The fallback in pkgver() is required: the fork is cloned without tags, git describe returns nothing and makepkg rejects an empty version.",
        },
        {
          cmd: udevRule,
          why: lang === "fr"
            ? "libfprint marque ce PID comme eligible a l'autosuspend USB via ID_AUTOSUSPEND=1. Ce quirk visait le driver elan, qui gerait le reveil. elanpress non : sans cette regle le capteur dort au bout de 2 secondes et ne repond plus."
            : "libfprint marks this PID as autosuspend-safe through ID_AUTOSUSPEND=1. That quirk targeted the elan driver, which handled wakeup. elanpress does not: without this rule the sensor sleeps after 2 seconds and stops answering.",
        },
        {
          cmd: "sudo systemctl stop fprintd && fprintd-list $USER",
          why: lang === "fr"
            ? "Verifie quel driver tourne. Attendu : ElanTech press-type fingerprint sensor (press). Si la sortie dit encore ElanTech Fingerprint Sensor, c'est le driver officiel. fprintd redemarre seul via D-Bus."
            : "Checks which driver is live. Expected: ElanTech press-type fingerprint sensor (press). If it still says ElanTech Fingerprint Sensor, that is the official driver. fprintd restarts itself through D-Bus.",
        },
      ],
    },
    {
      id: "enroll",
      title: lang === "fr" ? "Enrôlement" : "Enrollment",
      note: lang === "fr"
        ? "Les deux regles de gestuelle ci-dessus ne sont pas du confort : sans elles le driver attend indefiniment"
        : "The two gesture rules above are not comfort: without them the driver waits forever",
      entries: [
        {
          cmd: "fprintd-enroll -f right-index-finger",
          why: lang === "fr"
            ? "Environ 8 etapes jusqu'a enroll-completed. Lancer doigt a l'ecart, attendre une seconde, puis poser. Decaler legerement la zone du doigt entre les appuis (bords, pointe)."
            : "Roughly 8 stages until enroll-completed. Start with the finger away, wait a second, then press. Shift the finger area slightly between presses (edges, tip).",
        },
        {
          cmd: "fprintd-enroll -f right-middle-finger\nfprintd-enroll -f right-ring-finger",
          why: lang === "fr"
            ? "L'astuce contre les no-match : pam_fprintd fait un identify contre tous les doigts enroles, pas seulement celui qui est vise. J'enrole donc le meme index dans trois emplacements, avec des angles differents. Le matching hote d'elanpress est encore rudimentaire, trois modeles font une difference nette."
            : "The trick against no-match: pam_fprintd runs an identify against every enrolled finger, not just the targeted one. So I enroll the same index in three slots, at different angles. elanpress host-side matching is still rough, three templates make a clear difference.",
        },
        {
          cmd: "fprintd-verify",
          why: lang === "fr"
            ? "Trois sorties possibles, et la distinction compte : verify-match tout va bien, verify-no-match le doigt est lu mais ne correspond pas, fige sur Verify started! le capteur ne voit rien et il faut revoir la gestuelle."
            : "Three possible outcomes, and the distinction matters: verify-match all good, verify-no-match the finger is read but does not match, stuck on Verify started! the sensor sees nothing and the gesture needs fixing.",
        },
        {
          cmd: "fprintd-delete $USER",
          why: lang === "fr"
            ? "A faire imperativement apres tout changement de driver. Un template enrole avec un autre driver donne verify-no-match en boucle, sans aucune erreur dans les logs. Ca m'a coute une heure."
            : "Mandatory after any driver change. A template enrolled with another driver gives verify-no-match forever, with no error in the logs. That cost me an hour.",
        },
      ],
    },
    {
      id: "pam",
      title: "PAM",
      note: lang === "fr"
        ? "sufficient en tete de pile : le mot de passe reste toujours utilisable, aucun risque de lockout"
        : "sufficient at the top of the stack: the password always stays usable, no lockout risk",
      entries: [
        {
          cmd: pamLine,
          why: lang === "fr"
            ? "sufficient veut dire que si l'empreinte passe, c'est valide. Si elle echoue ou si le capteur ne repond pas, PAM continue vers les lignes suivantes et demande le mot de passe."
            : "sufficient means a recognised finger validates the stack. If it fails or the sensor does not answer, PAM falls through to the next lines and asks for the password.",
        },
        {
          cmd: "sudo cp -a /usr/lib/pam.d/polkit-1 /etc/pam.d/polkit-1",
          why: lang === "fr"
            ? "polkit-1 n'existe pas dans /etc/pam.d par defaut, il vit dans /usr/lib/pam.d. Le copier avant de l'editer, sinon la modification saute a la prochaine mise a jour de polkit."
            : "polkit-1 does not exist in /etc/pam.d by default, it lives in /usr/lib/pam.d. Copy it before editing, otherwise the change is wiped on the next polkit update.",
        },
        {
          cmd: "sudo -k && sudo true",
          why: lang === "fr"
            ? "Le test. Doit afficher Placez votre index droit sur le lecteur d'empreintes, puis basculer sur le mot de passe si aucun doigt n'est pose."
            : "The test. Should print Place your right index finger on the fingerprint reader, then fall back to the password if no finger is presented.",
        },
      ],
    },
    {
      id: "lock",
      title: lang === "fr" ? "Écran de verrouillage" : "Lock screen",
      note: lang === "fr"
        ? "pam_fprintd ne suffit pas ici : ni hyprlock ni Quickshell ne passent par la pile PAM du systeme"
        : "pam_fprintd is not enough here: neither hyprlock nor Quickshell go through the system PAM stack",
      entries: [
        {
          cmd: "strings /usr/bin/hyprlock | grep auth:fingerprint",
          why: lang === "fr"
            ? "hyprlock a son propre client fprintd en D-Bus depuis la 0.7, desactive par defaut. Il faut un bloc auth { fingerprint { enabled = true } } dans le fichier de conf reellement charge - attention si plusieurs configs coexistent, seule celle passee en -c compte."
            : "hyprlock has had its own D-Bus fprintd client since 0.7, disabled by default. It needs an auth { fingerprint { enabled = true } } block in the config file actually loaded - careful when several configs coexist, only the one passed to -c counts.",
        },
        {
          cmd: "auth sufficient pam_fprintd.so",
          why: lang === "fr"
            ? "Cote Quickshell, le PamContext dedie pointe vers un fichier PAM local au shell (chez moi services/pam/fprintd.conf). Une seule ligne suffit dans ce fichier."
            : "On the Quickshell side, the dedicated PamContext points at a shell-local PAM file (services/pam/fprintd.conf in my setup). A single line is enough in that file.",
        },
        {
          cmd: "pkill -f 'qs -p <shell>' && qs -p <shell> -d",
          why: lang === "fr"
            ? "Le piege : le shell ne teste la presence d'empreintes qu'une seule fois, a son demarrage. S'il tournait deja avant l'enrolement, le drapeau reste faux et le lecteur n'est jamais ecoute. Relancer le shell apres tout enrolement ou changement de driver."
            : "The trap: the shell only tests for enrolled fingerprints once, at startup. If it was already running before enrollment, the flag stays false and the reader is never watched. Restart the shell after any enrollment or driver change.",
        },
        {
          cmd: "onPamMessage: { if (fingerPam.messageIsError) { ... } }",
          why: lang === "fr"
            ? "Sans ce handler, aucun retour visuel sur les refus : pam_fprintd reessaie plusieurs fois en interne et chaque refus arrive en message PAM, pas dans onCompleted. L'ecran reste fige sur son invitation et donne l'impression d'un lecteur mort. messageIsError distingue le refus de l'invitation sans lire le texte, qui suit la locale systeme."
            : "Without this handler there is no visual feedback on refusals: pam_fprintd retries internally and each refusal arrives as a PAM message, not in onCompleted. The screen sits on its invitation and reads as a dead reader. messageIsError separates refusal from invitation without parsing the text, which follows the system locale.",
        },
      ],
    },
    {
      id: "suspend",
      title: lang === "fr" ? "Sortie de veille" : "Resume from suspend",
      note: lang === "fr"
        ? "Le probleme qui revient a chaque reveil sur un portable"
        : "The one that comes back on every wakeup on a laptop",
      entries: [
        {
          cmd: "sudo systemctl stop fprintd",
          why: lang === "fr"
            ? "Le deblocage immediat, sans reboot. Au reveil libfprint garde le device marque suspendu et le claim precedent reste accroche : Cannot run while suspended, ou The device has already been opened!"
            : "The immediate fix, no reboot needed. On wakeup libfprint keeps the device flagged suspended and the previous claim stays stuck: Cannot run while suspended, or The device has already been opened!",
        },
        {
          cmd: resumeUnit,
          why: lang === "fr"
            ? "Le correctif permanent, a activer avec systemctl enable fprintd-resume.service. Aucune perte : fprintd est active a la demande par D-Bus et rouvre le device avec un etat neuf a la premiere sollicitation."
            : "The permanent fix, enable it with systemctl enable fprintd-resume.service. Nothing is lost: fprintd is D-Bus activated and reopens the device with a fresh state on first use.",
        },
        {
          cmd: "lsusb -t",
          why: lang === "fr"
            ? "A savoir aussi : fprintd n'autorise qu'un seul client a la fois. Lancer fprintd-verify dans un terminal pendant que l'ecran de verrouillage reclame le lecteur en boucle produit le meme already been opened. Deverrouiller d'abord."
            : "Also worth knowing: fprintd allows a single client at a time. Running fprintd-verify in a terminal while the lock screen claims the reader in a loop produces the same already been opened. Unlock first.",
        },
      ],
    },
    {
      id: "debug",
      title: lang === "fr" ? "Dépannage" : "Troubleshooting",
      entries: [
        {
          cmd: debugRun,
          why: lang === "fr"
            ? "Le driver en mode verbeux. Ce qu'on cherche : finger lifted between enrollment stages a chaque etape signifie que le driver suit correctement le doigt. Son absence alors que le doigt est bien retire pointe un seuil de detection mal calibre, et la c'est un bug a remonter en amont."
            : "The driver in verbose mode. What to look for: finger lifted between enrollment stages at every stage means the driver is tracking the finger correctly. Its absence while the finger is genuinely lifted points at a miscalibrated detection threshold, and that is a bug worth reporting upstream.",
        },
        {
          cmd: "echo 3-3 | sudo tee /sys/bus/usb/drivers/usb/unbind\nsleep 1\necho 3-3 | sudo tee /sys/bus/usb/drivers/usb/bind",
          why: lang === "fr"
            ? "Rebind USB, remet l'etat interne du capteur a zero quand il est completement coince. Verifier le numero de bus avec lsusb -t, il peut changer. Arreter fprintd avant."
            : "USB rebind, resets the sensor internal state when it is fully stuck. Check the bus number with lsusb -t, it can change. Stop fprintd first.",
        },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <header className="mb-8 border-b border-border pb-6">
        <p className="mb-2 text-[11px] font-mono uppercase tracking-widest text-primary">Arch Linux</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Fingerprint</h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {lang === "fr"
            ? "Lecteur d'empreintes ELAN 04f3:0c6e sur ASUS ROG Flow X13 : driver elanpress, PAM, écran de verrouillage et sortie de veille."
            : "ELAN 04f3:0c6e fingerprint reader on ASUS ROG Flow X13: elanpress driver, PAM, lock screen and resume from suspend."}
        </p>
      </header>

      {/* ── Les deux regles de gestuelle ── */}
      <section id="gestures" className="mb-12">
        <h2 className="mb-1 font-mono text-xs uppercase tracking-widest text-primary">
          {lang === "fr" ? "Les deux règles" : "The two rules"}
        </h2>
        <p className="mb-4 font-mono text-[10px] text-muted-foreground/50">
          {lang === "fr"
            ? "A lire avant tout le reste : ces deux regles expliquent 90% des blocages"
            : "Read this before anything else: these two rules explain 90% of the hangs"}
        </p>

        <div className="rounded-sm border border-border/60 p-4">
          <p className="mb-1 font-mono text-xs text-primary">
            {lang === "fr" ? "1. Le lecteur doit être libre au moment où il est réclamé" : "1. The reader must be free when it is claimed"}
          </p>
          <p className="text-xs leading-6 text-muted-foreground">
            {lang === "fr"
              ? "La toute premiere image capturee apres la reclamation du lecteur sert de reference « pas de doigt ». Si un doigt est deja pose a cet instant, l'empreinte devient la reference, et plus aucun contact ne sera jamais detecte de toute la session. C'est le piege parfait sur un ecran de verrouillage, ou on tend deja la main vers le capteur pendant qu'il se lance."
              : "The very first frame captured after the reader is claimed becomes the “no finger” reference. If a finger is already resting there, your own print becomes the reference, and no touch will ever be detected for the rest of the session. It is the perfect trap on a lock screen, where your hand is already reaching for the sensor as it starts."}
          </p>
          <pre className="mt-3 overflow-x-auto rounded-sm bg-muted/30 p-3 text-xs text-foreground">
            <code>{`case CAPTURE_BG_SEND:
    if (self->background) { /* deja capture */ }
    elanpress_send_cmd (ssm, dev, cmd_get_image);  // sinon : capture le fond`}</code>
          </pre>
          <p className="mt-3 text-xs leading-6 text-muted-foreground">
            {lang === "fr"
              ? "Donc : lancer la commande doigt a l'ecart, attendre une seconde, puis poser."
              : "So: start the command with the finger away, wait one second, then press."}
          </p>
        </div>

        <div className="mt-4 rounded-sm border border-border/60 p-4">
          <p className="mb-1 font-mono text-xs text-primary">
            {lang === "fr" ? "2. Retirer complètement le doigt entre chaque étape" : "2. Fully lift the finger between stages"}
          </p>
          <p className="text-xs leading-6 text-muted-foreground">
            {lang === "fr"
              ? "Le driver exige 10 trames consecutives sans contact, a 30 ms, soit 300 ms de doigt totalement absent avant d'accepter l'appui suivant (ELANPRESS_FINGER_OFF_FRAMES). Un doigt qui reste en survol au-dessus du capteur bloque l'enrolement indefiniment, sans aucune erreur. Le rythme correct : appui franc environ 1 s, retrait net environ 1 s, recommencer. Pas de glissement ni de roulement pendant l'appui."
              : "The driver requires 10 consecutive touch-free frames at 30 ms, meaning 300 ms of fully absent finger before it accepts the next press (ELANPRESS_FINGER_OFF_FRAMES). A finger hovering just above the sensor blocks enrollment forever, with no error at all. The right rhythm: firm press about 1 s, clean lift about 1 s, repeat. No sliding or rolling while pressed."}
          </p>
        </div>
      </section>

      {sections.map((section) => (
        <section key={section.id} id={section.id} className="mb-10">
          <h2 className="mb-1 font-mono text-xs uppercase tracking-widest text-primary">
            {section.title}
          </h2>
          {section.note && (
            <p className="mb-4 font-mono text-[10px] text-muted-foreground/50">{section.note}</p>
          )}
          <div className={section.note ? "mt-3 space-y-4" : "mt-4 space-y-4"}>
            {section.entries.map((entry, i) => (
              <CheatsheetCommandCard key={i} cmd={entry.cmd} why={entry.why} lang={lang} />
            ))}
          </div>
        </section>
      ))}

      {/* ── Polkit ── */}
      <section id="polkit" className="mb-10 mt-12 border-t border-border pt-8">
        <h2 className="mb-1 font-mono text-xs uppercase tracking-widest text-primary">Polkit</h2>
        <div className="mt-4 rounded-sm border border-border/60 p-4">
          <p className="text-xs leading-6 text-muted-foreground">
            {lang === "fr"
              ? "Une popup de mot de passe pendant un fprintd-verify ne vient jamais du verify. La politique net.reactivated.fprint.device dit exactement qui demande quoi en session active :"
              : "A password popup during a fprintd-verify never comes from the verify. The net.reactivated.fprint.device policy says exactly who asks for what in an active session:"}
          </p>
          <pre className="mt-3 overflow-x-auto rounded-sm bg-muted/30 p-3 text-xs text-foreground">
            <code>{`verify       allow_active = yes              # jamais de mot de passe
enroll       allow_active = auth_self_keep   # ton mot de passe, puis memorise
setusername  allow_active = auth_admin_keep  # mot de passe admin`}</code>
          </pre>
          <p className="mt-3 text-xs leading-6 text-muted-foreground">
            {lang === "fr"
              ? "C'est donc un enrol, et le keep explique que la popup ne revienne pas ensuite."
              : "So it is an enroll, and the keep explains why the popup does not come back afterwards."}
          </p>
        </div>
      </section>

      {/* ── Maintenance ── */}
      <section id="maintenance" className="mb-10 mt-12 border-t border-border pt-8">
        <h2 className="mb-1 font-mono text-xs uppercase tracking-widest text-primary">Maintenance</h2>
        <div className="mt-4 rounded-sm border border-border/60 p-4">
          <p className="text-xs leading-6 text-muted-foreground">
            {lang === "fr"
              ? "Le paquet est compile localement. Une mise a jour de glib2, systemd ou libgusb peut casser l'ABI. Si l'empreinte cesse de fonctionner, recompiler avec makepkg -si puis sudo systemctl stop fprintd. pacman -Syu ne reinstalle pas libfprint officiel par-dessus, grace a provides et conflicts, mais verifier ne coute rien :"
              : "The package is built locally. A glib2, systemd or libgusb update can break the ABI. If the reader stops working, rebuild with makepkg -si then sudo systemctl stop fprintd. pacman -Syu will not reinstall official libfprint over it, thanks to provides and conflicts, but checking costs nothing:"}
          </p>
          <pre className="mt-3 overflow-x-auto rounded-sm bg-muted/30 p-3 text-xs text-foreground">
            <code>{`pacman -Q | grep libfprint`}</code>
          </pre>
        </div>
      </section>
    </div>
  );
}
