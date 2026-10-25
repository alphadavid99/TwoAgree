import { useT } from "../lib/i18n";

// The Bible copyright notice (Dave's answer 6: ESV everywhere, Amos 3:3 in the
// NKJV, notice on the About page). Wording follows each publisher's standard
// notice; Dave confirms Crossway's current terms before release.
export function ScriptureNotice() {
  const t = useT();
  return (
    <p className="scripture-notice">
      {t(
        "Scripture quotations are from the ESV® Bible (The Holy Bible, English Standard Version®), © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved. Amos 3:3 is taken from the New King James Version®. Copyright © 1982 by Thomas Nelson. Used by permission. All rights reserved.",
        "Les citations bibliques en anglais sont tirées de l’ESV® Bible (The Holy Bible, English Standard Version®), © 2001 by Crossway, a publishing ministry of Good News Publishers, avec permission ; Amos 3:3 de la New King James Version®, © 1982 by Thomas Nelson, avec permission. Tous droits réservés.",
      )}
    </p>
  );
}
