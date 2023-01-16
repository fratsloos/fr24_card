/**
 * Modified version of the script by FlightAware, including a modified version
 * of the database.
 *
 * @see https://github.com/flightaware/dump1090/blob/master/public_html/registrations.js
 * @see https://github.com/flightaware/dump1090/tree/master/public_html/db
 */
export default class Registration {
  constructor() {
    this.limitedAlphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // 24 chars; no I, O
    this.fullAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // 26 chars

    /**
     * Handles 3-letter suffixes assigned with a regular pattern
     *
     * start: first hexId of range
     * s1: major stride (interval between different first letters)
     * s2: minor stride (interval between different second letters)
     * prefix: the registration prefix
     *
     * optionally:
     *   alphabet: the alphabet to use (defaults fullAlphabet)
     *   first: the suffix to use at the start of the range (default: AAA)
     *   last: the last valid suffix in the range (default: ZZZ)
     */
    this.strideMappings = [
      { start: 0x008011, s1: 26 * 26, s2: 26, prefix: "ZS-" },

      { start: 0x390000, s1: 1024, s2: 32, prefix: "F-G" },
      { start: 0x398000, s1: 1024, s2: 32, prefix: "F-H" },

      {
        start: 0x3c4421,
        s1: 1024,
        s2: 32,
        prefix: "D-A",
        first: "AAA",
        last: "OZZ",
      },
      {
        start: 0x3c0001,
        s1: 26 * 26,
        s2: 26,
        prefix: "D-A",
        first: "PAA",
        last: "ZZZ",
      },
      {
        start: 0x3c8421,
        s1: 1024,
        s2: 32,
        prefix: "D-B",
        first: "AAA",
        last: "OZZ",
      },
      {
        start: 0x3c2001,
        s1: 26 * 26,
        s2: 26,
        prefix: "D-B",
        first: "PAA",
        last: "ZZZ",
      },
      { start: 0x3cc000, s1: 26 * 26, s2: 26, prefix: "D-C" },
      { start: 0x3d04a8, s1: 26 * 26, s2: 26, prefix: "D-E" },
      { start: 0x3d4950, s1: 26 * 26, s2: 26, prefix: "D-F" },
      { start: 0x3d8df8, s1: 26 * 26, s2: 26, prefix: "D-G" },
      { start: 0x3dd2a0, s1: 26 * 26, s2: 26, prefix: "D-H" },
      { start: 0x3e1748, s1: 26 * 26, s2: 26, prefix: "D-I" },

      { start: 0x448421, s1: 1024, s2: 32, prefix: "OO-" },
      { start: 0x458421, s1: 1024, s2: 32, prefix: "OY-" },
      { start: 0x460000, s1: 26 * 26, s2: 26, prefix: "OH-" },
      { start: 0x468421, s1: 1024, s2: 32, prefix: "SX-" },
      { start: 0x490421, s1: 1024, s2: 32, prefix: "CS-" },
      { start: 0x4a0421, s1: 1024, s2: 32, prefix: "YR-" },
      { start: 0x4b8421, s1: 1024, s2: 32, prefix: "TC-" },
      { start: 0x740421, s1: 1024, s2: 32, prefix: "JY-" },
      { start: 0x760421, s1: 1024, s2: 32, prefix: "AP-" },
      { start: 0x768421, s1: 1024, s2: 32, prefix: "9V-" },
      { start: 0x778421, s1: 1024, s2: 32, prefix: "YK-" },
      { start: 0x7c0000, s1: 36 * 36, s2: 36, prefix: "VH-" },
      { start: 0xc00001, s1: 26 * 26, s2: 26, prefix: "C-F" },
      { start: 0xc044a9, s1: 26 * 26, s2: 26, prefix: "C-G" },
      { start: 0xe01041, s1: 4096, s2: 64, prefix: "LV-" },
    ];

    /**
     * Numeric registrations
     *   start: start hexId in range
     *   first: first numeric registration
     *   count: number of numeric registrations
     *   template: registration template, trailing characters are replaced with
     *     the numeric registration
     */
    this.numericMappings = [
      { start: 0x140000, first: 0, count: 100000, template: "RA-00000" },
      { start: 0x0b03e8, first: 1000, count: 1000, template: "CU-T0000" },
    ];

    // Fill in some derived data
    for (let i = 0; i < this.strideMappings.length; ++i) {
      let mapping = this.strideMappings[i];

      if (!mapping.alphabet) {
        mapping.alphabet = this.fullAlphabet;
      }

      if (mapping.first) {
        let c1 = mapping.alphabet.indexOf(mapping.first.charAt(0));
        let c2 = mapping.alphabet.indexOf(mapping.first.charAt(1));
        let c3 = mapping.alphabet.indexOf(mapping.first.charAt(2));
        mapping.offset = c1 * mapping.s1 + c2 * mapping.s2 + c3;
      } else {
        mapping.offset = 0;
      }

      if (mapping.last) {
        let c1 = mapping.alphabet.indexOf(mapping.last.charAt(0));
        let c2 = mapping.alphabet.indexOf(mapping.last.charAt(1));
        let c3 = mapping.alphabet.indexOf(mapping.last.charAt(2));
        mapping.end =
          mapping.start -
          mapping.offset +
          c1 * mapping.s1 +
          c2 * mapping.s2 +
          c3;
      } else {
        mapping.end =
          mapping.start -
          mapping.offset +
          (mapping.alphabet.length - 1) * mapping.s1 +
          (mapping.alphabet.length - 1) * mapping.s2 +
          (mapping.alphabet.length - 1);
      }
    }

    for (let i = 0; i < this.numericMappings.length; ++i) {
      this.numericMappings[i].end =
        this.numericMappings[i].start + this.numericMappings[i].count - 1;
    }
  }

  lookup = function (hexId) {
    let reg;

    // First search in static database
    reg = this.databaseReg(hexId);
    if (reg) {
      return reg;
    }

    // Second search in RegEx functions
    hexId = +("0x" + hexId);

    if (isNaN(hexId)) {
      return null;
    }

    reg = this.nReg(hexId);
    if (reg) {
      return reg;
    }

    reg = this.jaReg(hexId);
    if (reg) {
      return reg;
    }

    reg = this.hlReg(hexId);
    if (reg) {
      return reg;
    }

    reg = this.numericReg(hexId);
    if (reg) {
      return reg;
    }

    reg = this.strideReg(hexId);
    if (reg) {
      return reg;
    }

    return null;
  };

  databaseReg = function (hexId) {
    return window.fr24db[hexId] ?? "";
  };

  strideReg = function (hexId) {
    // try the mappings in strideMappings
    let i;
    for (i = 0; i < this.strideMappings.length; ++i) {
      let mapping = this.strideMappings[i];
      if (hexId < mapping.start || hexId > mapping.end) continue;

      let offset = hexId - mapping.start + mapping.offset;

      let i1 = Math.floor(offset / mapping.s1);
      offset = offset % mapping.s1;
      let i2 = Math.floor(offset / mapping.s2);
      offset = offset % mapping.s2;
      let i3 = offset;

      if (
        i1 < 0 ||
        i1 >= mapping.alphabet.length ||
        i2 < 0 ||
        i2 >= mapping.alphabet.length ||
        i3 < 0 ||
        i3 >= mapping.alphabet.length
      )
        continue;

      return (
        mapping.prefix +
        mapping.alphabet.charAt(i1) +
        mapping.alphabet.charAt(i2) +
        mapping.alphabet.charAt(i3)
      );
    }

    // nothing
    return null;
  };

  numericReg = function (hexId) {
    // try the mappings in numericMappings
    let i;
    for (i = 0; i < this.numericMappings.length; ++i) {
      let mapping = this.numericMappings[i];
      if (hexId < mapping.start || hexId > mapping.end) continue;

      let reg = hexId - mapping.start + mapping.first + "";
      return (
        mapping.template.substring(0, mapping.template.length - reg.length) +
        reg
      );
    }
  };

  //
  // US N-numbers
  //

  nLetters = function (rem) {
    if (rem == 0) return "";

    --rem;
    return (
      this.limitedAlphabet.charAt(Math.floor(rem / 25)) + this.nLetter(rem % 25)
    );
  };

  nLetter = function (rem) {
    if (rem == 0) return "";

    --rem;
    return this.limitedAlphabet.charAt(rem);
  };

  nReg = function (hexId) {
    let offset = hexId - 0xa00001;
    if (offset < 0 || offset >= 915399) {
      return null;
    }

    let digit1 = Math.floor(offset / 101711) + 1;
    let reg = "N" + digit1;
    offset = offset % 101711;
    if (offset <= 600) {
      // Na, NaA .. NaZ, NaAA .. NaZZ
      return reg + this.nLetters(offset);
    }

    // Na0* .. Na9*
    offset -= 601;

    let digit2 = Math.floor(offset / 10111);
    reg += digit2;
    offset = offset % 10111;

    if (offset <= 600) {
      // Nab, NabA..NabZ, NabAA..NabZZ
      return reg + this.nLetters(offset);
    }

    // Nab0* .. Nab9*
    offset -= 601;

    let digit3 = Math.floor(offset / 951);
    reg += digit3;
    offset = offset % 951;

    if (offset <= 600) {
      // Nabc, NabcA .. NabcZ, NabcAA .. NabcZZ
      return reg + this.nLetters(offset);
    }

    // Nabc0* .. Nabc9*
    offset -= 601;

    let digit4 = Math.floor(offset / 35);
    reg += digit4.toFixed(0);
    offset = offset % 35;

    if (offset <= 24) {
      // Nabcd, NabcdA .. NabcdZ
      return reg + this.nLetter(offset);
    }

    // Nabcd0 .. Nabcd9
    offset -= 25;
    return reg + offset.toFixed(0);
  };

  // South Korea
  hlReg = function (hexId) {
    if (hexId >= 0x71ba00 && hexId <= 0x71bf99) {
      return "HL" + (hexId - 0x71ba00 + 0x7200).toString(16);
    }

    if (hexId >= 0x71c000 && hexId <= 0x71c099) {
      return "HL" + (hexId - 0x71c000 + 0x8000).toString(16);
    }

    if (hexId >= 0x71c200 && hexId <= 0x71c299) {
      return "HL" + (hexId - 0x71c200 + 0x8200).toString(16);
    }

    return null;
  };

  // Japan
  jaReg = function (hexId) {
    let offset = hexId - 0x840000;
    if (offset < 0 || offset >= 229840) return null;

    let reg = "JA";

    let digit1 = Math.floor(offset / 22984);
    if (digit1 < 0 || digit1 > 9) return null;
    reg += digit1;
    offset = offset % 22984;

    let digit2 = Math.floor(offset / 916);
    if (digit2 < 0 || digit2 > 9) return null;
    reg += digit2;
    offset = offset % 916;

    if (offset < 340) {
      // 3rd is a digit, 4th is a digit or letter
      let digit3 = Math.floor(offset / 34);
      reg += digit3;
      offset = offset % 34;

      if (offset < 10) {
        // 4th is a digit
        return reg + offset;
      }

      // 4th is a letter
      offset -= 10;
      return reg + this.limitedAlphabet.charAt(offset);
    }

    // 3rd and 4th are letters
    offset -= 340;
    let letter3 = Math.floor(offset / 24);
    return (
      reg +
      this.limitedAlphabet.charAt(letter3) +
      this.limitedAlphabet.charAt(offset % 24)
    );
  };
}
