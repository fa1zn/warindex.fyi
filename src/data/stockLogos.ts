// Stock brand colors and logos
// Using img.logo.dev API (free, no key needed for basic usage)
export interface StockBrand {
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  domain: string;
}

// Helper to generate logo URL from domain
const logoUrl = (domain: string) => `https://img.logo.dev/${domain}?token=pk_X-1ZO13GSgeOoUrIuJ6GMQ`;

export const stockBrands: Record<string, StockBrand> = {
  // US Defense & Tech
  LMT: {
    primaryColor: "#005288",
    secondaryColor: "#FFFFFF",
    logoUrl: logoUrl("lockheedmartin.com"),
    domain: "lockheedmartin.com"
  },
  RTX: {
    primaryColor: "#00529B",
    secondaryColor: "#FFFFFF",
    logoUrl: logoUrl("rtx.com"),
    domain: "rtx.com"
  },
  PLTR: {
    primaryColor: "#101820",
    secondaryColor: "#FFFFFF",
    logoUrl: logoUrl("palantir.com"),
    domain: "palantir.com"
  },
  CVX: {
    primaryColor: "#0066B2",
    secondaryColor: "#FFFFFF",
    logoUrl: logoUrl("chevron.com"),
    domain: "chevron.com"
  },
  BA: {
    primaryColor: "#0033A0",
    secondaryColor: "#FFFFFF",
    logoUrl: logoUrl("boeing.com"),
    domain: "boeing.com"
  },
  GD: {
    primaryColor: "#003DA5",
    secondaryColor: "#FFFFFF",
    logoUrl: logoUrl("gd.com"),
    domain: "gd.com"
  },
  NOC: {
    primaryColor: "#003768",
    secondaryColor: "#FFFFFF",
    logoUrl: logoUrl("northropgrumman.com"),
    domain: "northropgrumman.com"
  },

  // Russia
  GAZP: {
    primaryColor: "#0079C1",
    secondaryColor: "#FFFFFF",
    logoUrl: logoUrl("gazprom.com"),
    domain: "gazprom.com"
  },
  SBER: {
    primaryColor: "#21A038",
    secondaryColor: "#FFFFFF",
    logoUrl: logoUrl("sberbank.ru"),
    domain: "sberbank.ru"
  },
  ROSN: {
    primaryColor: "#FFCC00",
    secondaryColor: "#000000",
    logoUrl: logoUrl("rosneft.com"),
    domain: "rosneft.com"
  },

  // China
  BABA: {
    primaryColor: "#FF6A00",
    secondaryColor: "#FFFFFF",
    logoUrl: logoUrl("alibaba.com"),
    domain: "alibaba.com"
  },
  TSM: {
    primaryColor: "#C4161C",
    secondaryColor: "#FFFFFF",
    logoUrl: logoUrl("tsmc.com"),
    domain: "tsmc.com"
  },
  PTR: {
    primaryColor: "#CC0000",
    secondaryColor: "#FFD700",
    logoUrl: logoUrl("petrochina.com.cn"),
    domain: "petrochina.com.cn"
  },

  // Germany
  RHM: {
    primaryColor: "#003366",
    secondaryColor: "#FFFFFF",
    logoUrl: logoUrl("rheinmetall.com"),
    domain: "rheinmetall.com"
  },
  SIE: {
    primaryColor: "#009999",
    secondaryColor: "#FFFFFF",
    logoUrl: logoUrl("siemens.com"),
    domain: "siemens.com"
  },
  BAS: {
    primaryColor: "#21225E",
    secondaryColor: "#FFFFFF",
    logoUrl: logoUrl("basf.com"),
    domain: "basf.com"
  },

  // Saudi Arabia
  "2222.SR": {
    primaryColor: "#00843D",
    secondaryColor: "#FFFFFF",
    logoUrl: logoUrl("aramco.com"),
    domain: "aramco.com"
  },
  "1180.SR": {
    primaryColor: "#004B87",
    secondaryColor: "#FFFFFF",
    logoUrl: logoUrl("alrajhibank.com.sa"),
    domain: "alrajhibank.com.sa"
  },
  "2010.SR": {
    primaryColor: "#003366",
    secondaryColor: "#FFFFFF",
    logoUrl: logoUrl("sabic.com"),
    domain: "sabic.com"
  },

  // UK
  "BA.L": {
    primaryColor: "#D3002D",
    secondaryColor: "#FFFFFF",
    logoUrl: logoUrl("baesystems.com"),
    domain: "baesystems.com"
  },
  "SHEL.L": {
    primaryColor: "#FFD500",
    secondaryColor: "#DD1D21",
    logoUrl: logoUrl("shell.com"),
    domain: "shell.com"
  },
  "BP.L": {
    primaryColor: "#009900",
    secondaryColor: "#FFD700",
    logoUrl: logoUrl("bp.com"),
    domain: "bp.com"
  },

  // Israel
  ESLT: {
    primaryColor: "#0038B8",
    secondaryColor: "#FFFFFF",
    logoUrl: logoUrl("elbitsystems.com"),
    domain: "elbitsystems.com"
  },
  NICE: {
    primaryColor: "#003087",
    secondaryColor: "#FFFFFF",
    logoUrl: logoUrl("nice.com"),
    domain: "nice.com"
  },
  CHKP: {
    primaryColor: "#E21836",
    secondaryColor: "#FFFFFF",
    logoUrl: logoUrl("checkpoint.com"),
    domain: "checkpoint.com"
  },

  // Taiwan
  "2330.TW": {
    primaryColor: "#C4161C",
    secondaryColor: "#FFFFFF",
    logoUrl: logoUrl("tsmc.com"),
    domain: "tsmc.com"
  },
  "2317.TW": {
    primaryColor: "#00A0E9",
    secondaryColor: "#FFFFFF",
    logoUrl: logoUrl("foxconn.com"),
    domain: "foxconn.com"
  },
  "2454.TW": {
    primaryColor: "#0072BC",
    secondaryColor: "#FFFFFF",
    logoUrl: logoUrl("mediatek.com"),
    domain: "mediatek.com"
  },

  // Japan
  "7011.T": {
    primaryColor: "#E60012",
    secondaryColor: "#FFFFFF",
    logoUrl: logoUrl("mhi.com"),
    domain: "mhi.com"
  },
  "6501.T": {
    primaryColor: "#E60012",
    secondaryColor: "#FFFFFF",
    logoUrl: logoUrl("hitachi.com"),
    domain: "hitachi.com"
  },
  "6702.T": {
    primaryColor: "#0072C6",
    secondaryColor: "#FFFFFF",
    logoUrl: logoUrl("fujitsu.com"),
    domain: "fujitsu.com"
  },

  // South Korea
  "005930.KS": {
    primaryColor: "#1428A0",
    secondaryColor: "#FFFFFF",
    logoUrl: logoUrl("samsung.com"),
    domain: "samsung.com"
  },
  "000660.KS": {
    primaryColor: "#EE3124",
    secondaryColor: "#FFFFFF",
    logoUrl: logoUrl("skhynix.com"),
    domain: "skhynix.com"
  },
  "012330.KS": {
    primaryColor: "#0066B3",
    secondaryColor: "#FFFFFF",
    logoUrl: logoUrl("hyundai.com"),
    domain: "hyundai.com"
  },

  // India
  HAL: {
    primaryColor: "#138808",
    secondaryColor: "#FFFFFF",
    logoUrl: logoUrl("hal-india.co.in"),
    domain: "hal-india.co.in"
  },
  BPCL: {
    primaryColor: "#003087",
    secondaryColor: "#FFD700",
    logoUrl: logoUrl("bharatpetroleum.in"),
    domain: "bharatpetroleum.in"
  },
  BEL: {
    primaryColor: "#FF6600",
    secondaryColor: "#FFFFFF",
    logoUrl: logoUrl("bel-india.in"),
    domain: "bel-india.in"
  },

  // Poland
  PGE: {
    primaryColor: "#FF6600",
    secondaryColor: "#FFFFFF",
    logoUrl: logoUrl("gkpge.pl"),
    domain: "gkpge.pl"
  },
  PKO: {
    primaryColor: "#003B7C",
    secondaryColor: "#FFFFFF",
    logoUrl: logoUrl("pkobp.pl"),
    domain: "pkobp.pl"
  },
  "PKN.WA": {
    primaryColor: "#E30613",
    secondaryColor: "#FFFFFF",
    logoUrl: logoUrl("orlen.pl"),
    domain: "orlen.pl"
  },

  // Turkey
  "ASELS.IS": {
    primaryColor: "#E30A17",
    secondaryColor: "#FFFFFF",
    logoUrl: logoUrl("aselsan.com.tr"),
    domain: "aselsan.com.tr"
  },
  "TUPRS.IS": {
    primaryColor: "#ED1C24",
    secondaryColor: "#FFFFFF",
    logoUrl: logoUrl("tupras.com.tr"),
    domain: "tupras.com.tr"
  },
  "THYAO.IS": {
    primaryColor: "#CC2131",
    secondaryColor: "#FFFFFF",
    logoUrl: logoUrl("turkishairlines.com"),
    domain: "turkishairlines.com"
  },

  // France
  "HO.PA": {
    primaryColor: "#FF0000",
    secondaryColor: "#FFFFFF",
    logoUrl: logoUrl("thalesgroup.com"),
    domain: "thalesgroup.com"
  },
  "SAF.PA": {
    primaryColor: "#003DA5",
    secondaryColor: "#FFFFFF",
    logoUrl: logoUrl("safran-group.com"),
    domain: "safran-group.com"
  },
  "TTE.PA": {
    primaryColor: "#DA291C",
    secondaryColor: "#FFFFFF",
    logoUrl: logoUrl("totalenergies.com"),
    domain: "totalenergies.com"
  },

  // Australia
  "WDS.AX": {
    primaryColor: "#00A4E4",
    secondaryColor: "#FFFFFF",
    logoUrl: logoUrl("woodside.com.au"),
    domain: "woodside.com.au"
  },
  "STO.AX": {
    primaryColor: "#003087",
    secondaryColor: "#FFFFFF",
    logoUrl: logoUrl("santos.com"),
    domain: "santos.com"
  },
  "EOS.AX": {
    primaryColor: "#1E3A5F",
    secondaryColor: "#FFFFFF",
    logoUrl: logoUrl("eos-aus.com"),
    domain: "eos-aus.com"
  },

  // Norway
  "EQNR.OL": {
    primaryColor: "#DA291C",
    secondaryColor: "#FFFFFF",
    logoUrl: logoUrl("equinor.com"),
    domain: "equinor.com"
  },
  "DNB.OL": {
    primaryColor: "#046A38",
    secondaryColor: "#FFFFFF",
    logoUrl: logoUrl("dnb.no"),
    domain: "dnb.no"
  },
  "AKER.OL": {
    primaryColor: "#003366",
    secondaryColor: "#FFFFFF",
    logoUrl: logoUrl("akerasa.com"),
    domain: "akerasa.com"
  },

  // Brazil
  "PETR4.SA": {
    primaryColor: "#007B5F",
    secondaryColor: "#FFD700",
    logoUrl: logoUrl("petrobras.com.br"),
    domain: "petrobras.com.br"
  },
  "VALE3.SA": {
    primaryColor: "#417A1A",
    secondaryColor: "#FFFFFF",
    logoUrl: logoUrl("vale.com"),
    domain: "vale.com"
  },
  "EMBR3.SA": {
    primaryColor: "#003366",
    secondaryColor: "#FFFFFF",
    logoUrl: logoUrl("embraer.com"),
    domain: "embraer.com"
  },

  // Additional defense stocks
  TEVA: {
    primaryColor: "#003DA5",
    secondaryColor: "#FFFFFF",
    logoUrl: logoUrl("teva.com"),
    domain: "teva.com"
  },
  DAL: {
    primaryColor: "#003366",
    secondaryColor: "#E31837",
    logoUrl: logoUrl("delta.com"),
    domain: "delta.com"
  },
  TSLA: {
    primaryColor: "#CC0000",
    secondaryColor: "#FFFFFF",
    logoUrl: logoUrl("tesla.com"),
    domain: "tesla.com"
  },
  EADSY: {
    primaryColor: "#00205B",
    secondaryColor: "#FFFFFF",
    logoUrl: logoUrl("airbus.com"),
    domain: "airbus.com"
  },
  SSNLF: {
    primaryColor: "#1428A0",
    secondaryColor: "#FFFFFF",
    logoUrl: logoUrl("samsung.com"),
    domain: "samsung.com"
  },
};

// Get stock brand with fallback
export function getStockBrand(ticker: string): StockBrand {
  return stockBrands[ticker] || {
    primaryColor: "#374151",
    secondaryColor: "#FFFFFF",
    logoUrl: "",
    domain: ""
  };
}
