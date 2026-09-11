export type ProductId = "oura" | "iphone";
export type Part = { name:string; description:string; material:string; color:string };
export type Product = { name:string; number:string; category:string; subtitle:string; finish:string; description:string; source:string; sourceLabel:string; parts:Part[] };
export const products:Record<ProductId,Product> = {
 oura:{name:"Oura Ring 4",number:"01",category:"WEARABLE TECHNOLOGY",subtitle:"A world of sensing, wrapped around a finger.",finish:"SILVER / TITANIUM",description:"Explore the shell, curved electronics, and sensors that turn a small ring into a wearable companion.",source:"https://support.ouraring.com/hc/en-us/articles/33045011508115-Oura-Ring-4",sourceLabel:"Oura Ring 4 hardware overview",parts:[
  {name:"Titanium shell",color:"#a6a9ae",material:"TITANIUM · STRUCTURE",description:"A durable outer titanium band protects the electronics. Its continuous, rounded surface lets the technology feel like a piece of jewelry."},
  {name:"Inner titanium liner",color:"#d0d2d5",material:"TITANIUM · SKIN CONTACT",description:"The inner titanium surface rests against the finger. Recessed optical windows let the sensors work through the ring’s inner face."},
  {name:"Flexible circuit",color:"#b79545",material:"FLEXIBLE SUBSTRATE · INTERCONNECT",description:"A curved circuit carries power and signals around the band, connecting the sensors, control electronics, and battery in a very small space."},
  {name:"Curved battery",color:"#565963",material:"RECHARGEABLE CELL · POWER",description:"A compact rechargeable battery stores energy for sensing and wireless communication. Its curved form uses the space inside the band."},
  {name:"Optical sensors",color:"#528e71",material:"LEDs + PHOTODETECTORS · OPTICS",description:"LEDs illuminate the skin while photodetectors measure returning light. Changes in these signals help estimate heart rate and other physiological measures."},
  {name:"Motion sensor",color:"#4b6478",material:"ACCELEROMETER · MOVEMENT",description:"A tiny accelerometer detects movement. Its signals help the ring recognize activity and interpret periods of rest."},
  {name:"Temperature sensors",color:"#c47e58",material:"TEMPERATURE SENSING · TRENDS",description:"Temperature sensors track changes at the finger over time, adding context to the ring’s overnight measurements."},
  {name:"Control & wireless",color:"#5f6570",material:"PROCESSING + BLUETOOTH · CONNECTION",description:"Control electronics coordinate measurements and connect the ring to its companion app over Bluetooth. This study groups the processing and radio circuitry."}
 ]},
 iphone:{name:"iPhone 16 Pro",number:"02",category:"PERSONAL TECHNOLOGY",subtitle:"An entire toolkit, fitting in your pocket.",finish:"NATURAL TITANIUM / GLASS",description:"Unfold a familiar silhouette into its display, cameras, power system, and miniature computing hardware.",source:"https://support.apple.com/en-us/121031",sourceLabel:"iPhone 16 Pro technical specifications",parts:[
  {name:"Display assembly",color:"#292e3b",material:"OLED + COVER GLASS · DISPLAY",description:"The OLED panel creates the image while the cover glass protects the surface. Touch sensing turns gestures into input."},
  {name:"Titanium frame",color:"#a2a09b",material:"TITANIUM + ALUMINUM · STRUCTURE",description:"An outer titanium band and internal structure support the device. Side controls, antenna breaks, and mounting points are integrated around its edges."},
  {name:"Back glass",color:"#c3c1bc",material:"GLASS · ENCLOSURE",description:"The rear panel closes the enclosure while allowing wireless charging. It sits behind the battery and internal assemblies."},
  {name:"Battery",color:"#45474e",material:"LITHIUM-ION · ENERGY",description:"The rechargeable battery supplies power to the phone. Its large footprint reflects how much space portable energy storage requires."},
  {name:"Logic board & A18 Pro",color:"#497665",material:"CIRCUIT BOARD + SILICON · COMPUTING",description:"The logic board connects the phone’s core electronics. The A18 Pro handles computation, graphics, and on-device machine learning."},
  {name:"Fusion camera",color:"#577c93",material:"LENSES + IMAGE SENSOR · MAIN CAMERA",description:"The 48MP Fusion camera is the primary rear camera. A lens stack focuses incoming light onto its image sensor."},
  {name:"Ultra Wide camera",color:"#638b98",material:"LENSES + IMAGE SENSOR · WIDE FIELD",description:"The 48MP Ultra Wide camera captures a wider field of view and supports close-up macro photography."},
  {name:"Telephoto camera",color:"#4d5d78",material:"FOLDED OPTICS · 5× TELEPHOTO",description:"A folded optical path enables 5× optical telephoto reach. This simplified module shows the lens and sensor assembly."},
  {name:"TrueDepth assembly",color:"#707481",material:"CAMERA + INFRARED · DEPTH",description:"Front-facing cameras and infrared components work together for Face ID and depth sensing. They sit behind the top of the display."},
  {name:"Taptic Engine",color:"#90949c",material:"LINEAR ACTUATOR · TOUCH FEEDBACK",description:"An electromagnetic actuator moves a small mass to create precise tactile feedback, from keyboard taps to alerts."},
  {name:"Speaker assembly",color:"#5a6066",material:"DRIVER + ENCLOSURE · SOUND",description:"A small speaker driver turns electrical signals into sound. The enclosure and acoustic outlets help direct it out of the phone."},
  {name:"MagSafe & charging coil",color:"#ad8150",material:"COPPER + MAGNETS · WIRELESS POWER",description:"A coil receives energy from a compatible wireless charger. A ring of magnets aligns the phone with MagSafe chargers and accessories."},
  {name:"USB-C assembly",color:"#a7a6a0",material:"CONNECTOR + FLEX · POWER & DATA",description:"The USB-C connector provides a wired path for charging and data. A flexible circuit connects the port to the rest of the phone."}
 ]}
};
