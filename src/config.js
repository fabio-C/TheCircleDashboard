/*
	Stations can be on three class type:
		normal: station with sensors, etc
		motor: control of greenhouse motors
		flux: control of water flux, pump, fluxometers, etc

		6 June 2020:

		serra1 (1)
			nft (normali)
			cassoni (normali)
			cisterna (normali)
			laterali (motore)

		serra2 (2)
			nft_dx (normali)
			nft_sx (norali)
			flusso_dx (flusso)
			flusso_sx (flusso)
			lateral (motore)

		semenzaio (3)
			irrigazione_s (normale)
			laterali_s (motore)

		tunnel1 (4)
			irrigazione_t1 (normale)
			laterali_t1 (motore)
*/

export default {
  api_baseurl: "http://ec2-52-59-247-75.eu-central-1.compute.amazonaws.com:8080/api",
  stations_serra1: [
  	["nft", "normal"], 
  	["cassoni", "normal"], 
  	["cisterna", "normal"], 
  	["laterali", "motor"]
  ],
  stations_serra2: [
  	["nft_sx", "normal"],
  	["nft_dx", "normal"],
  	["flusso_dx", "flux"],
   ["flusso_sx", "flux"],
  	["lateral", "motor"]
  ],
  stations_semenzaio: [
  	["irrigazione_s", "normal"],
  	["laterali_s", "motor"]
  ],
  stations_tunnel1: [
	["irrigazione_t1", "normal"],
  	["laterali_t1", "motor"]
  ]
};