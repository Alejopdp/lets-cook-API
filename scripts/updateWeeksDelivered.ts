import { Customer } from "../src/bounded_contexts/operations/domain/customer/Customer";
import { mongooseCustomerRepository } from "../src/bounded_contexts/operations/infra/repositories/customer";
import { connectToDatabase } from "../src/infraestructure/mongoose/config/config";

export async function updateWeeksDelivered() {
    console.log("Starting script");
    process.env.NODE_ENV = "development";
    process.env.URLDB = "mongodb://localhost:27017/lets-cook-local";
    await connectToDatabase();
    const customers: Customer[] = await mongooseCustomerRepository.findAll();
    const customersEmailMap: { [email: string]: Customer } = {};

    for (let customer of customers) {
        customersEmailMap[customer.email] = customer;
    }

    for (let customer of customersToUpdate.customers) {
        console.log("Processing customer: ", customer.email);
        const customerToUpdate = customersEmailMap[customer.email];
        if (!customerToUpdate) continue;
        const arrayOfDate = customer.first_order_date.split("/");
        arrayOfDate[0] = (parseInt(arrayOfDate[0]) - 1).toString();
        // const firstOrderDate = arrayOfDate.join("/");

        customerToUpdate.shopifyReceivedOrdersQuantity = parseInt(customer.weeks_delivered);
        customerToUpdate.firstOrderDate = new Date(parseInt(arrayOfDate[2]), parseInt(arrayOfDate[0]), parseInt(arrayOfDate[1]));
    }

    await mongooseCustomerRepository.updateMany(customers);
    console.log("Greacefully returning");
    return;
}

updateWeeksDelivered();

const customersToUpdate = {
    customers: [
        {
            email: "alejo@novolabs.xyz",
            weeks_delivered: "98",
            first_order_date: "10/29/2019",
        },
        {
            email: "nicoescasany@gmail.com",
            weeks_delivered: "98",
            first_order_date: "10/29/2019",
        },
        {
            email: "olga.kotkowska@gmail.com",
            weeks_delivered: "93",
            first_order_date: "5/3/2019",
        },
        {
            email: "marianne@yellow-training.com",
            weeks_delivered: "58",
            first_order_date: "4/6/2019",
        },
        {
            email: "araujomullernicolas@gmail.com",
            weeks_delivered: "8",
            first_order_date: "11/28/2019",
        },
        {
            email: "willfleury@gmail.com",
            weeks_delivered: "113",
            first_order_date: "4/8/2019",
        },
        {
            email: "mariaparra.rodriguez@gmail.com",
            weeks_delivered: "102",
            first_order_date: "4/8/2019",
        },
        {
            email: "mdgiagnorio@gmail.com",
            weeks_delivered: "87",
            first_order_date: "7/7/2019",
        },
        {
            email: "benjamin.loss@hotmail.com",
            weeks_delivered: "15",
            first_order_date: "4/26/2019",
        },
        {
            email: "barbschael@gmail.com",
            weeks_delivered: "96",
            first_order_date: "5/3/2019",
        },
        {
            email: "evelynhg1107@gmail.com",
            weeks_delivered: "8",
            first_order_date: "5/7/2019",
        },
        {
            email: "sombra.ignacio@gmail.com",
            weeks_delivered: "60",
            first_order_date: "5/19/2019",
        },
        {
            email: "sebastianhdzsa@gmail.com",
            weeks_delivered: "1",
            first_order_date: "5/30/2019",
        },
        {
            email: "neolithicgorgon@gmail.com",
            weeks_delivered: "1",
            first_order_date: "5/30/2019",
        },
        {
            email: "ekbuel@gmx.de",
            weeks_delivered: "53",
            first_order_date: "6/1/2019",
        },
        {
            email: "garciavallevero@gmail.com",
            weeks_delivered: "28",
            first_order_date: "6/1/2019",
        },
        {
            email: "mark@kirkov.dk",
            weeks_delivered: "70",
            first_order_date: "6/1/2019",
        },
        {
            email: "mail@halfpapdesign.de",
            weeks_delivered: "53",
            first_order_date: "6/1/2019",
        },
        {
            email: "Vmpierre@gmail.com",
            weeks_delivered: "66",
            first_order_date: "6/1/2019",
        },
        {
            email: "antonkroisant@googlemail.com",
            weeks_delivered: "7",
            first_order_date: "6/1/2019",
        },
        {
            email: "thebenseck@gmail.com",
            weeks_delivered: "12",
            first_order_date: "6/2/2019",
        },
        {
            email: "alexa.kfoury@gmail.com",
            weeks_delivered: "3",
            first_order_date: "6/2/2019",
        },
        {
            email: "rosario_signorello@icloud.com",
            weeks_delivered: "8",
            first_order_date: "6/2/2019",
        },
        {
            email: "santiagocastiella@hotmail.com",
            weeks_delivered: "121",
            first_order_date: "6/4/2019",
        },
        {
            email: "marcel@octaevo.com",
            weeks_delivered: "26",
            first_order_date: "6/26/2019",
        },
        {
            email: "julia_sanchez_125@hotmail.com",
            weeks_delivered: "3",
            first_order_date: "7/3/2019",
        },
        {
            email: "estefy_g89@hotmail.com",
            weeks_delivered: "59",
            first_order_date: "7/5/2019",
        },
        {
            email: "contactmarlacarpenter@gmail.com",
            weeks_delivered: "1",
            first_order_date: "7/6/2019",
        },
        {
            email: "kwtaylor83@gmail.com",
            weeks_delivered: "1",
            first_order_date: "7/6/2019",
        },
        {
            email: "Michiel.vanderHeide@gmail.com",
            weeks_delivered: "46",
            first_order_date: "7/6/2019",
        },
        {
            email: "46carmona@gmail.com",
            weeks_delivered: "35",
            first_order_date: "7/7/2019",
        },
        {
            email: "gorka_bon@hotmail.com",
            weeks_delivered: "1",
            first_order_date: "7/7/2019",
        },
        {
            email: "pro.arantxa.ordoyo@gmail.com",
            weeks_delivered: "1",
            first_order_date: "7/7/2019",
        },
        {
            email: "raquelvazquezcoronado@gmail.com",
            weeks_delivered: "17",
            first_order_date: "7/7/2019",
        },
        {
            email: "javier.barberan.sanchez@gmail.com",
            weeks_delivered: "8",
            first_order_date: "7/7/2019",
        },
        {
            email: "helenedjvh@gmail.com",
            weeks_delivered: "7",
            first_order_date: "7/7/2019",
        },
        {
            email: "cjimenezvic@gmail.com",
            weeks_delivered: "8",
            first_order_date: "7/7/2019",
        },
        {
            email: "sancar1983@gmail.com",
            weeks_delivered: "37",
            first_order_date: "7/7/2019",
        },
        {
            email: "claudio.belcampo@gmail.com",
            weeks_delivered: "1",
            first_order_date: "7/7/2019",
        },
        {
            email: "ipandres90@gmail.com",
            weeks_delivered: "100",
            first_order_date: "7/7/2019",
        },
        {
            email: "nueveseistres@gmail.com",
            weeks_delivered: "51",
            first_order_date: "7/12/2019",
        },
        {
            email: "alejwp@gmail.com",
            weeks_delivered: "4",
            first_order_date: "7/17/2019",
        },
        {
            email: "riko.nyberg@yahoo.com",
            weeks_delivered: "14",
            first_order_date: "8/13/2019",
        },
        {
            email: "ppatel@exoftware.com",
            weeks_delivered: "9",
            first_order_date: "8/21/2019",
        },
        {
            email: "uriel@urielsalis.me",
            weeks_delivered: "47",
            first_order_date: "8/25/2019",
        },
        {
            email: "xmirasma@gmail.com",
            weeks_delivered: "6",
            first_order_date: "8/29/2019",
        },
        {
            email: "benitzmc@gmail.com",
            weeks_delivered: "87",
            first_order_date: "8/31/2019",
        },
        {
            email: "milda.joku@gmail.com",
            weeks_delivered: "36",
            first_order_date: "8/31/2019",
        },
        {
            email: "xicombd@gmail.com",
            weeks_delivered: "7",
            first_order_date: "9/1/2019",
        },
        {
            email: "donialove@gmail.com",
            weeks_delivered: "19",
            first_order_date: "9/1/2019",
        },
        {
            email: "s4giordanino@yahoo.es",
            weeks_delivered: "45",
            first_order_date: "9/7/2019",
        },
        {
            email: "iolanda.calvo@uab.cat",
            weeks_delivered: "7",
            first_order_date: "9/7/2019",
        },
        {
            email: "cafpavan@gmail.com",
            weeks_delivered: "3",
            first_order_date: "9/7/2019",
        },
        {
            email: "ecervera@audiocerver.com",
            weeks_delivered: "14",
            first_order_date: "9/7/2019",
        },
        {
            email: "manudag@gmail.com",
            weeks_delivered: "10",
            first_order_date: "9/7/2019",
        },
        {
            email: "vaikttor@hotmail.com",
            weeks_delivered: "40",
            first_order_date: "9/8/2019",
        },
        {
            email: "mribaltahuelmo@gmail.com",
            weeks_delivered: "1",
            first_order_date: "9/8/2019",
        },
        {
            email: "harrisfellman@gmail.com",
            weeks_delivered: "27",
            first_order_date: "9/8/2019",
        },
        {
            email: "maria.vangen.jordet@gmail.com",
            weeks_delivered: "30",
            first_order_date: "9/8/2019",
        },
        {
            email: "r3dmund@gmail.com",
            weeks_delivered: "81",
            first_order_date: "9/8/2019",
        },
        {
            email: "sardatorrandell@gmail.com",
            weeks_delivered: "7",
            first_order_date: "9/8/2019",
        },
        {
            email: "gandalfsaxe@gmail.com",
            weeks_delivered: "86",
            first_order_date: "9/8/2019",
        },
        {
            email: "mark_davidson5@hotmail.com",
            weeks_delivered: "34",
            first_order_date: "9/12/2019",
        },
        {
            email: "amolina@tax.es",
            weeks_delivered: "5",
            first_order_date: "9/12/2019",
        },
        {
            email: "hello@morenocollective.com",
            weeks_delivered: "11",
            first_order_date: "9/13/2019",
        },
        {
            email: "rtapiavet@gmail.com",
            weeks_delivered: "93",
            first_order_date: "9/13/2019",
        },
        {
            email: "attwood@live.co.uk",
            weeks_delivered: "53",
            first_order_date: "9/19/2019",
        },
        {
            email: "ryan.romanes@gmail.com",
            weeks_delivered: "7",
            first_order_date: "9/20/2019",
        },
        {
            email: "toma.aleknaviciute@gmail.com",
            weeks_delivered: "23",
            first_order_date: "9/23/2019",
        },
        {
            email: "jordipadros1977@gmail.com",
            weeks_delivered: "2",
            first_order_date: "9/24/2019",
        },
        {
            email: "leatonetti@gmail.com",
            weeks_delivered: "10",
            first_order_date: "9/25/2019",
        },
        {
            email: "carinabjerge@hotmail.com",
            weeks_delivered: "35",
            first_order_date: "9/25/2019",
        },
        {
            email: "csaxkjaer@gmail.com",
            weeks_delivered: "32",
            first_order_date: "9/26/2019",
        },
        {
            email: "mayajudd@gmail.com",
            weeks_delivered: "71",
            first_order_date: "9/29/2019",
        },
        {
            email: "isabella.toppenberg@gmail.com",
            weeks_delivered: "80",
            first_order_date: "9/29/2019",
        },
        {
            email: "gouw.tim@gmail.com",
            weeks_delivered: "56",
            first_order_date: "9/29/2019",
        },
        {
            email: "khooling44@outlook.com",
            weeks_delivered: "30",
            first_order_date: "9/29/2019",
        },
        {
            email: "desiree.falter@gmail.com",
            weeks_delivered: "86",
            first_order_date: "10/4/2019",
        },
        {
            email: "carole.lionet@gmail.com",
            weeks_delivered: "1",
            first_order_date: "10/5/2019",
        },
        {
            email: "gsegarra@protonmail.com",
            weeks_delivered: "1",
            first_order_date: "10/5/2019",
        },
        {
            email: "replaycos@gmail.com",
            weeks_delivered: "11",
            first_order_date: "10/5/2019",
        },
        {
            email: "sebastienloisy@gmail.com",
            weeks_delivered: "80",
            first_order_date: "10/5/2019",
        },
        {
            email: "lacg456@gmail.com",
            weeks_delivered: "37",
            first_order_date: "10/5/2019",
        },
        {
            email: "nonnacasas@gmail.com",
            weeks_delivered: "66",
            first_order_date: "10/6/2019",
        },
        {
            email: "elviraln@hotmail.com",
            weeks_delivered: "18",
            first_order_date: "10/6/2019",
        },
        {
            email: "sol.y.jacques@gmail.com",
            weeks_delivered: "70",
            first_order_date: "10/6/2019",
        },
        {
            email: "flodelepinay@gmail.com",
            weeks_delivered: "55",
            first_order_date: "10/6/2019",
        },
        {
            email: "gustavobrugiafreddo@hotmail.com",
            weeks_delivered: "4",
            first_order_date: "10/6/2019",
        },
        {
            email: "michelle.spencer.72@gmail.com",
            weeks_delivered: "101",
            first_order_date: "10/6/2019",
        },
        {
            email: "leila_scheffers@hotmail.com",
            weeks_delivered: "17",
            first_order_date: "10/9/2019",
        },
        {
            email: "nadin1977@yahoo.de",
            weeks_delivered: "4",
            first_order_date: "10/12/2019",
        },
        {
            email: "magali.dejaegher@gmail.com",
            weeks_delivered: "13",
            first_order_date: "10/17/2019",
        },
        {
            email: "irismagrorojo@gmail.com",
            weeks_delivered: "25",
            first_order_date: "10/19/2019",
        },
        {
            email: "jorgearaujom@gmail.com",
            weeks_delivered: "5",
            first_order_date: "10/20/2019",
        },
        {
            email: "katie_rich@hotmail.com",
            weeks_delivered: "34",
            first_order_date: "10/24/2019",
        },
        {
            email: "picksy92@hotmail.com",
            weeks_delivered: "7",
            first_order_date: "10/29/2019",
        },
        {
            email: "mc2840@yahoo.dk",
            weeks_delivered: "1",
            first_order_date: "10/30/2019",
        },
        {
            email: "mandermandeep@hotmail.com",
            weeks_delivered: "96",
            first_order_date: "10/31/2019",
        },
        {
            email: "angieporcel@gmail.com",
            weeks_delivered: "16",
            first_order_date: "10/31/2019",
        },
        {
            email: "adamzemmoura@gmail.com",
            weeks_delivered: "39",
            first_order_date: "11/1/2019",
        },
        {
            email: "lina@agentedigital.com",
            weeks_delivered: "31",
            first_order_date: "11/2/2019",
        },
        {
            email: "michelleruz@yahoo.com",
            weeks_delivered: "1",
            first_order_date: "11/2/2019",
        },
        {
            email: "linashopping5@gmail.com",
            weeks_delivered: "62",
            first_order_date: "11/2/2019",
        },
        {
            email: "lina.jure@icloud.com",
            weeks_delivered: "1",
            first_order_date: "11/2/2019",
        },
        {
            email: "shannonnakache@me.com",
            weeks_delivered: "2",
            first_order_date: "11/3/2019",
        },
        {
            email: "kleber20@gmail.com",
            weeks_delivered: "2",
            first_order_date: "11/3/2019",
        },
        {
            email: "aagje.peleman@gmail.com",
            weeks_delivered: "29",
            first_order_date: "11/3/2019",
        },
        {
            email: "anna.indira.m@gmail.com",
            weeks_delivered: "1",
            first_order_date: "11/3/2019",
        },
        {
            email: "mauri.benavente@gmail.com",
            weeks_delivered: "12",
            first_order_date: "11/4/2019",
        },
        {
            email: "camilo.luna85@gmail.com",
            weeks_delivered: "6",
            first_order_date: "11/4/2019",
        },
        {
            email: "mariannenore@hotmail.com",
            weeks_delivered: "19",
            first_order_date: "1/22/2021",
        },
        {
            email: "tathyotero@gmail.com",
            weeks_delivered: "45",
            first_order_date: "11/6/2019",
        },
        {
            email: "ignacio.velazquez@icloud.com",
            weeks_delivered: "27",
            first_order_date: "11/10/2019",
        },
        {
            email: "eliacasasfz@gmail.com",
            weeks_delivered: "2",
            first_order_date: "11/13/2019",
        },
        {
            email: "ANTERIOR - s.j.vestit@gmail.com",
            weeks_delivered: "5",
            first_order_date: "11/17/2019",
        },
        {
            email: "xuriyet@gmail.com",
            weeks_delivered: "4",
            first_order_date: "11/17/2019",
        },
        {
            email: "senorita.timms@gmail.com",
            weeks_delivered: "35",
            first_order_date: "11/17/2019",
        },
        {
            email: "machez@hotmail.com",
            weeks_delivered: "44",
            first_order_date: "11/17/2019",
        },
        {
            email: "lilybluestocking@gmail.com",
            weeks_delivered: "33",
            first_order_date: "11/17/2019",
        },
        {
            email: "aurelie_et_laurent@yahoo.com",
            weeks_delivered: "66",
            first_order_date: "11/17/2019",
        },
        {
            email: "5971888@mail.ru",
            weeks_delivered: "11",
            first_order_date: "11/18/2019",
        },
        {
            email: "bkleinelastra@gmail.com",
            weeks_delivered: "1",
            first_order_date: "11/21/2019",
        },
        {
            email: "kirsty@trychameleon.com",
            weeks_delivered: "4",
            first_order_date: "11/21/2019",
        },
        {
            email: "milsydavis@gmail.com",
            weeks_delivered: "40",
            first_order_date: "11/22/2019",
        },
        {
            email: "louisehvam@hotmail.com",
            weeks_delivered: "28",
            first_order_date: "11/22/2019",
        },
        {
            email: "mvearp@gmail.com",
            weeks_delivered: "1",
            first_order_date: "11/24/2019",
        },
        {
            email: "luciezakova@hotmail.com",
            weeks_delivered: "1",
            first_order_date: "11/28/2019",
        },
        {
            email: "t.bloomfield9@gmail.com",
            weeks_delivered: "61",
            first_order_date: "11/28/2019",
        },
        {
            email: "clobato@eada.edu",
            weeks_delivered: "46",
            first_order_date: "12/1/2019",
        },
        {
            email: "martinuria@hotmail.com",
            weeks_delivered: "4",
            first_order_date: "11/30/2019",
        },
        {
            email: "surfychick777@yahoo.com.au",
            weeks_delivered: "11",
            first_order_date: "12/3/2019",
        },
        {
            email: "alicebocchi@gmail.com",
            weeks_delivered: "1",
            first_order_date: "12/7/2019",
        },
        {
            email: "saraluna28@gmail.com",
            weeks_delivered: "1",
            first_order_date: "12/7/2019",
        },
        {
            email: "igorbregana@gmail.com",
            weeks_delivered: "78",
            first_order_date: "12/7/2019",
        },
        {
            email: "homesbytammy@sbcglobal.net",
            weeks_delivered: "2",
            first_order_date: "12/8/2019",
        },
        {
            email: "jhesus34@yahoo.es",
            weeks_delivered: "1",
            first_order_date: "12/8/2019",
        },
        {
            email: "eleroder@gmail.com",
            weeks_delivered: "2",
            first_order_date: "12/8/2019",
        },
        {
            email: "alessiotmr@yahoo.it",
            weeks_delivered: "1",
            first_order_date: "12/8/2019",
        },
        {
            email: "mateo.guadalfajara@gmail.com",
            weeks_delivered: "18",
            first_order_date: "12/8/2019",
        },
        {
            email: "rougehuma@gmail.com",
            weeks_delivered: "3",
            first_order_date: "12/8/2019",
        },
        {
            email: "gustav@letscooknow.es",
            weeks_delivered: "92",
            first_order_date: "12/8/2019",
        },
        {
            email: "amyaharris@gmail.com",
            weeks_delivered: "7",
            first_order_date: "12/14/2019",
        },
        {
            email: "joy_guidi@yahoo.com",
            weeks_delivered: "11",
            first_order_date: "12/14/2019",
        },
        {
            email: "tguzmanm@hotmail.com",
            weeks_delivered: "10",
            first_order_date: "12/14/2019",
        },
        {
            email: "hernandez.paula.182@gmail.com",
            weeks_delivered: "86",
            first_order_date: "12/14/2019",
        },
        {
            email: "estefanygomezcortes@gmail.com",
            weeks_delivered: "6",
            first_order_date: "12/16/2019",
        },
        {
            email: "fxrescbe@gmail.com",
            weeks_delivered: "64",
            first_order_date: "12/17/2019",
        },
        {
            email: "james.regal@hotmail.com",
            weeks_delivered: "42",
            first_order_date: "12/29/2019",
        },
        {
            email: "cjtayl89@gmail.com",
            weeks_delivered: "21",
            first_order_date: "12/30/2019",
        },
        {
            email: "miquelcristobal@gmail.com",
            weeks_delivered: "4",
            first_order_date: "1/4/2020",
        },
        {
            email: "Jane.mitchell2412@gmail.com",
            weeks_delivered: "67",
            first_order_date: "1/5/2020",
        },
        {
            email: "nathalysepulveda@hotmail.com",
            weeks_delivered: "70",
            first_order_date: "1/6/2020",
        },
        {
            email: "xenia@nomadsevents.com",
            weeks_delivered: "6",
            first_order_date: "1/8/2020",
        },
        {
            email: "imendes95@msn.com",
            weeks_delivered: "26",
            first_order_date: "1/11/2020",
        },
        {
            email: "meaganbellovin@gmail.com",
            weeks_delivered: "18",
            first_order_date: "1/16/2020",
        },
        {
            email: "vgarzon@bodas.net",
            weeks_delivered: "2",
            first_order_date: "1/17/2020",
        },
        {
            email: "andrewcarle@gmail.com",
            weeks_delivered: "28",
            first_order_date: "1/18/2020",
        },
        {
            email: "bansoodeb@gmail.com",
            weeks_delivered: "21",
            first_order_date: "1/23/2020",
        },
        {
            email: "tammyb@ecrayons.com",
            weeks_delivered: "66",
            first_order_date: "1/24/2020",
        },
        {
            email: "karenswift@sky.com",
            weeks_delivered: "47",
            first_order_date: "1/24/2020",
        },
        {
            email: "xavier.noriega.serra@gmail.com",
            weeks_delivered: "5",
            first_order_date: "1/29/2020",
        },
        {
            email: "john@the-millers.eu",
            weeks_delivered: "6",
            first_order_date: "1/29/2020",
        },
        {
            email: "karen05@me.com",
            weeks_delivered: "56",
            first_order_date: "1/31/2020",
        },
        {
            email: "angelaescola92@gmail.com",
            weeks_delivered: "1",
            first_order_date: "2/1/2020",
        },
        {
            email: "angeles-serrano@hotmail.com",
            weeks_delivered: "50",
            first_order_date: "2/1/2020",
        },
        {
            email: "neyled@hotmail.com",
            weeks_delivered: "37",
            first_order_date: "2/1/2020",
        },
        {
            email: "jorge.claramunt@seat.es",
            weeks_delivered: "6",
            first_order_date: "2/1/2020",
        },
        {
            email: "markwatson97@live.co.uk",
            weeks_delivered: "5",
            first_order_date: "2/1/2020",
        },
        {
            email: "aaaline@hotmail.com",
            weeks_delivered: "92",
            first_order_date: "2/1/2020",
        },
        {
            email: "samaire.josep@gmail.com",
            weeks_delivered: "51",
            first_order_date: "2/1/2020",
        },
        {
            email: "rectoreta@hotmail.com",
            weeks_delivered: "1",
            first_order_date: "2/2/2020",
        },
        {
            email: "wtg007@bucknell.edu",
            weeks_delivered: "6",
            first_order_date: "2/3/2020",
        },
        {
            email: "esthelaford15@yahoo.com",
            weeks_delivered: "46",
            first_order_date: "2/5/2020",
        },
        {
            email: "farah@rahulkapoor.com",
            weeks_delivered: "4",
            first_order_date: "2/7/2020",
        },
        {
            email: "heather.delehant@gmail.com",
            weeks_delivered: "4",
            first_order_date: "2/7/2020",
        },
        {
            email: "eduard.blanch.urban@gmail.com",
            weeks_delivered: "2",
            first_order_date: "2/11/2020",
        },
        {
            email: "berrywrobel@gmail.com",
            weeks_delivered: "19",
            first_order_date: "2/11/2020",
        },
        {
            email: "daustin121@yahoo.com",
            weeks_delivered: "87",
            first_order_date: "2/13/2020",
        },
        {
            email: "jac070@bucknell.edu",
            weeks_delivered: "3",
            first_order_date: "2/19/2020",
        },
        {
            email: "pelagiedefoort@yahoo.fr",
            weeks_delivered: "76",
            first_order_date: "2/20/2020",
        },
        {
            email: "rafael@ecoetica.es",
            weeks_delivered: "8",
            first_order_date: "2/20/2020",
        },
        {
            email: "mariano.ure@gmail.com",
            weeks_delivered: "68",
            first_order_date: "2/20/2020",
        },
        {
            email: "majacquinot@gmail.com",
            weeks_delivered: "48",
            first_order_date: "2/26/2020",
        },
        {
            email: "carly@type-coach.com",
            weeks_delivered: "2",
            first_order_date: "2/27/2020",
        },
        {
            email: "cena.johanna@gmail.com",
            weeks_delivered: "59",
            first_order_date: "2/27/2020",
        },
        {
            email: "nichole_ozdemir@yahoo.com",
            weeks_delivered: "13",
            first_order_date: "2/27/2020",
        },
        {
            email: "cesaralaboy@gmail.com",
            weeks_delivered: "1",
            first_order_date: "2/27/2020",
        },
        {
            email: "anguita.lauraisa@gmail.com",
            weeks_delivered: "2",
            first_order_date: "2/27/2020",
        },
        {
            email: "matiase.rubio@gmail.com",
            weeks_delivered: "1",
            first_order_date: "2/27/2020",
        },
        {
            email: "yvalle5@hotmail.com",
            weeks_delivered: "1",
            first_order_date: "2/27/2020",
        },
        {
            email: "tanida.tim@googlemail.com",
            weeks_delivered: "9",
            first_order_date: "2/27/2020",
        },
        {
            email: "julien.eychenne@hotmail.fr",
            weeks_delivered: "2",
            first_order_date: "2/27/2020",
        },
        {
            email: "lu.rossetti@hotmail.it",
            weeks_delivered: "1",
            first_order_date: "2/27/2020",
        },
        {
            email: "sofia16@gmail.com",
            weeks_delivered: "1",
            first_order_date: "2/29/2020",
        },
        {
            email: "ned@tectonica.co",
            weeks_delivered: "29",
            first_order_date: "3/1/2020",
        },
        {
            email: "emma.sewart@outlook.com",
            weeks_delivered: "49",
            first_order_date: "3/1/2020",
        },
        {
            email: "mmobry@hotmail.com",
            weeks_delivered: "1",
            first_order_date: "3/2/2020",
        },
        {
            email: "cristinaandrushko@gmail.com",
            weeks_delivered: "13",
            first_order_date: "3/2/2020",
        },
        {
            email: "tobias.hoffmann@crg.eu",
            weeks_delivered: "64",
            first_order_date: "3/2/2020",
        },
        {
            email: "meganeileen.mcd@gmail.com",
            weeks_delivered: "54",
            first_order_date: "3/3/2020",
        },
        {
            email: "challuedde@gmail.com",
            weeks_delivered: "77",
            first_order_date: "3/3/2020",
        },
        {
            email: "acarollo@asbarcelona.com",
            weeks_delivered: "23",
            first_order_date: "3/4/2020",
        },
        {
            email: "marjolein.bloemhof@gmail.com",
            weeks_delivered: "52",
            first_order_date: "3/5/2020",
        },
        {
            email: "jenniferkillion.1@gmail.com",
            weeks_delivered: "78",
            first_order_date: "3/6/2020",
        },
        {
            email: "kim.marina.ed@gmail.com",
            weeks_delivered: "29",
            first_order_date: "3/7/2020",
        },
        {
            email: "leenderslente@hotmail.com",
            weeks_delivered: "4",
            first_order_date: "3/9/2020",
        },
        {
            email: "soniajuanvitaller@hotmail.com",
            weeks_delivered: "23",
            first_order_date: "3/9/2020",
        },
        {
            email: "genutf@yahoo.es",
            weeks_delivered: "48",
            first_order_date: "3/9/2020",
        },
        {
            email: "katsx@hotmail.com",
            weeks_delivered: "19",
            first_order_date: "3/9/2020",
        },
        {
            email: "britta@bitxos.info",
            weeks_delivered: "1",
            first_order_date: "3/13/2020",
        },
        {
            email: "misswahlen@hotmail.com",
            weeks_delivered: "17",
            first_order_date: "3/20/2020",
        },
        {
            email: "alba.guardiola@gmail.com",
            weeks_delivered: "1",
            first_order_date: "3/20/2020",
        },
        {
            email: "yavanna.valencia@edu.vlerick.com",
            weeks_delivered: "10",
            first_order_date: "3/20/2020",
        },
        {
            email: "spencer.evoy@gmail.com",
            weeks_delivered: "72",
            first_order_date: "3/21/2020",
        },
        {
            email: "fastconn72@gmail.com",
            weeks_delivered: "3",
            first_order_date: "3/24/2020",
        },
        {
            email: "pamela.mckillop@gmail.com",
            weeks_delivered: "8",
            first_order_date: "3/25/2020",
        },
        {
            email: "dunk.gail@gmail.com",
            weeks_delivered: "7",
            first_order_date: "3/27/2020",
        },
        {
            email: "megconnolly3@gmail.com",
            weeks_delivered: "58",
            first_order_date: "3/28/2020",
        },
        {
            email: "sagoher@gmail.com",
            weeks_delivered: "53",
            first_order_date: "3/28/2020",
        },
        {
            email: "abonifacie@gmail.com",
            weeks_delivered: "14",
            first_order_date: "3/28/2020",
        },
        {
            email: "enniodybeli@gmail.com",
            weeks_delivered: "7",
            first_order_date: "3/28/2020",
        },
        {
            email: "mol.sven@gmail.com",
            weeks_delivered: "58",
            first_order_date: "3/30/2020",
        },
        {
            email: "griffm@gmail.com",
            weeks_delivered: "1",
            first_order_date: "4/1/2020",
        },
        {
            email: "ffox@asbarcelona.com",
            weeks_delivered: "25",
            first_order_date: "4/2/2020",
        },
        {
            email: "katiemurphy@live.co.uk",
            weeks_delivered: "70",
            first_order_date: "4/3/2020",
        },
        {
            email: "fmurgades@gmail.com",
            weeks_delivered: "12",
            first_order_date: "4/7/2020",
        },
        {
            email: "alykorepanova@gmail.com",
            weeks_delivered: "2",
            first_order_date: "4/6/2020",
        },
        {
            email: "swimr1013@yahoo.com",
            weeks_delivered: "29",
            first_order_date: "4/7/2020",
        },
        {
            email: "rplaszowski@gmail.com",
            weeks_delivered: "15",
            first_order_date: "4/8/2020",
        },
        {
            email: "dinosahrus@aol.com",
            weeks_delivered: "19",
            first_order_date: "4/9/2020",
        },
        {
            email: "chris_hunt@hotmail.com",
            weeks_delivered: "10",
            first_order_date: "4/10/2020",
        },
        {
            email: "sandra.rams@iese.net",
            weeks_delivered: "1",
            first_order_date: "4/13/2020",
        },
        {
            email: "vmastwijk@gmail.com",
            weeks_delivered: "10",
            first_order_date: "4/13/2020",
        },
        {
            email: "sophienavarro85@gmail.com",
            weeks_delivered: "12",
            first_order_date: "4/14/2020",
        },
        {
            email: "nfbatlle@gmail.com",
            weeks_delivered: "3",
            first_order_date: "4/15/2020",
        },
        {
            email: "strelnikova.yulia@gmail.com",
            weeks_delivered: "27",
            first_order_date: "4/17/2020",
        },
        {
            email: "juanpe_ro@hotmail.com",
            weeks_delivered: "14",
            first_order_date: "4/21/2020",
        },
        {
            email: "kresta@hotmail.com",
            weeks_delivered: "10",
            first_order_date: "4/22/2020",
        },
        {
            email: "irinalya@gmail.com",
            weeks_delivered: "58",
            first_order_date: "4/22/2020",
        },
        {
            email: "melissamiller79@yahoo.com",
            weeks_delivered: "47",
            first_order_date: "4/22/2020",
        },
        {
            email: "wmejiav00@hotmail.com",
            weeks_delivered: "1",
            first_order_date: "4/22/2020",
        },
        {
            email: "birgitte.bohnsen@iese.net",
            weeks_delivered: "45",
            first_order_date: "4/23/2020",
        },
        {
            email: "agibarkoczi@gmail.com",
            weeks_delivered: "1",
            first_order_date: "4/23/2020",
        },
        {
            email: "thekirbyhome@btinternet.com",
            weeks_delivered: "8",
            first_order_date: "4/24/2020",
        },
        {
            email: "viktordavidsson77@gmail.com",
            weeks_delivered: "9",
            first_order_date: "4/26/2020",
        },
        {
            email: "cochez.sophie@hotmail.fr",
            weeks_delivered: "1",
            first_order_date: "4/28/2020",
        },
        {
            email: "pederson@live.ca",
            weeks_delivered: "1",
            first_order_date: "4/28/2020",
        },
        {
            email: "bizpspriya@gmail.com",
            weeks_delivered: "1",
            first_order_date: "4/29/2020",
        },
        {
            email: "odile.wust@gmail.com",
            weeks_delivered: "42",
            first_order_date: "4/29/2020",
        },
        {
            email: "bmenchon@gmail.com",
            weeks_delivered: "1",
            first_order_date: "5/1/2020",
        },
        {
            email: "rigazio.emma@orange.fr",
            weeks_delivered: "59",
            first_order_date: "5/2/2020",
        },
        {
            email: "cindyjansen@gmx.de",
            weeks_delivered: "9",
            first_order_date: "5/3/2020",
        },
        {
            email: "daniela.losada@gmail.com",
            weeks_delivered: "40",
            first_order_date: "5/4/2020",
        },
        {
            email: "isabeloliva26@hotmail.com",
            weeks_delivered: "2",
            first_order_date: "5/5/2020",
        },
        {
            email: "ymbern@gmail.com",
            weeks_delivered: "52",
            first_order_date: "5/6/2020",
        },
        {
            email: "soyjesus91@icloud.com",
            weeks_delivered: "13",
            first_order_date: "5/6/2020",
        },
        {
            email: "dianamendez85@gmail.com",
            weeks_delivered: "2",
            first_order_date: "5/7/2020",
        },
        {
            email: "ccrescenti@asbarcelona.com",
            weeks_delivered: "71",
            first_order_date: "5/10/2020",
        },
        {
            email: "Barthodk@gmail.com",
            weeks_delivered: "45",
            first_order_date: "5/10/2020",
        },
        {
            email: "colas.raynal@gmail.com",
            weeks_delivered: "56",
            first_order_date: "5/11/2020",
        },
        {
            email: "taniagrifols@hotmail.com",
            weeks_delivered: "2",
            first_order_date: "5/12/2020",
        },
        {
            email: "jrodriguezayos@gmail.com",
            weeks_delivered: "1",
            first_order_date: "5/13/2020",
        },
        {
            email: "ebolanos615@hotmail.com",
            weeks_delivered: "7",
            first_order_date: "5/13/2020",
        },
        {
            email: "catschuitemaker@hotmail.com",
            weeks_delivered: "35",
            first_order_date: "5/14/2020",
        },
        {
            email: "amalvarezgomez@gmail.com",
            weeks_delivered: "71",
            first_order_date: "5/14/2020",
        },
        {
            email: "james.r.taylor@live.com.au",
            weeks_delivered: "46",
            first_order_date: "5/15/2020",
        },
        {
            email: "hadda.hreidarsdottir@gmail.com",
            weeks_delivered: "2",
            first_order_date: "5/18/2020",
        },
        {
            email: "bcnerin@msn.com",
            weeks_delivered: "18",
            first_order_date: "5/18/2020",
        },
        {
            email: "awen99@gmail.com",
            weeks_delivered: "1",
            first_order_date: "5/18/2020",
        },
        {
            email: "stradiottol10@gmail.com",
            weeks_delivered: "24",
            first_order_date: "5/19/2020",
        },
        {
            email: "rene.rauch@outlook.de",
            weeks_delivered: "3",
            first_order_date: "5/19/2020",
        },
        {
            email: "hangovershotes@gmail.com",
            weeks_delivered: "1",
            first_order_date: "5/20/2020",
        },
        {
            email: "matt.philpott@autodesk.com",
            weeks_delivered: "2",
            first_order_date: "5/21/2020",
        },
        {
            email: "carolinearora@hotmail.com",
            weeks_delivered: "5",
            first_order_date: "5/21/2020",
        },
        {
            email: "davidao1982@hotmail.com",
            weeks_delivered: "2",
            first_order_date: "5/22/2020",
        },
        {
            email: "martabaneress@gmail.com",
            weeks_delivered: "1",
            first_order_date: "5/23/2020",
        },
        {
            email: "lilisha.burris@gmail.com",
            weeks_delivered: "1",
            first_order_date: "5/23/2020",
        },
        {
            email: "michaela.o.foster@gmail.com",
            weeks_delivered: "53",
            first_order_date: "5/23/2020",
        },
        {
            email: "mazin.elnohi@icloud.com",
            weeks_delivered: "1",
            first_order_date: "5/24/2020",
        },
        {
            email: "bjorn@vmsweden.com",
            weeks_delivered: "17",
            first_order_date: "5/24/2020",
        },
        {
            email: "anarossettic@gmail.com",
            weeks_delivered: "3",
            first_order_date: "5/25/2020",
        },
        {
            email: "rbggoce@gmail.com",
            weeks_delivered: "39",
            first_order_date: "5/30/2020",
        },
        {
            email: "sanghaes@gmail.com",
            weeks_delivered: "2",
            first_order_date: "6/3/2020",
        },
        {
            email: "ale_2flores@hotmail.com",
            weeks_delivered: "20",
            first_order_date: "6/10/2020",
        },
        {
            email: "anarrebelo92@gmail.com",
            weeks_delivered: "31",
            first_order_date: "6/8/2020",
        },
        {
            email: "lia.morse@gmail.com",
            weeks_delivered: "4",
            first_order_date: "6/15/2020",
        },
        {
            email: "joaquinvf@gmail.com",
            weeks_delivered: "4",
            first_order_date: "6/16/2020",
        },
        {
            email: "SILGALVI@GMAIL.COM",
            weeks_delivered: "2",
            first_order_date: "6/18/2020",
        },
        {
            email: "magaly.viveros@gmail.com",
            weeks_delivered: "1",
            first_order_date: "6/18/2020",
        },
        {
            email: "jacquelinebakels@gmail.com",
            weeks_delivered: "14",
            first_order_date: "6/21/2020",
        },
        {
            email: "sevimcaliskansc@gmail.com",
            weeks_delivered: "18",
            first_order_date: "6/23/2020",
        },
        {
            email: "catalinagrs813@gmail.com",
            weeks_delivered: "8",
            first_order_date: "6/23/2020",
        },
        {
            email: "jonat.pires89@gmail.com",
            weeks_delivered: "1",
            first_order_date: "6/24/2020",
        },
        {
            email: "leigh.e.o@gmail.com",
            weeks_delivered: "4",
            first_order_date: "6/25/2020",
        },
        {
            email: "polly@hey.com",
            weeks_delivered: "3",
            first_order_date: "6/28/2020",
        },
        {
            email: "ysabellamerced@gmail.com",
            weeks_delivered: "10",
            first_order_date: "6/29/2020",
        },
        {
            email: "wilsonvictoria36@googlemail.com",
            weeks_delivered: "12",
            first_order_date: "7/1/2020",
        },
        {
            email: "kduym@yahoo.com",
            weeks_delivered: "13",
            first_order_date: "7/1/2020",
        },
        {
            email: "katrinagufler@gmail.com",
            weeks_delivered: "47",
            first_order_date: "7/3/2020",
        },
        {
            email: "miriam_riera@hotmail.com",
            weeks_delivered: "1",
            first_order_date: "7/3/2020",
        },
        {
            email: "vasart@gmail.com",
            weeks_delivered: "13",
            first_order_date: "7/5/2020",
        },
        {
            email: "claudia.treacy@Yahoo.com",
            weeks_delivered: "2",
            first_order_date: "7/7/2020",
        },
        {
            email: "ambar.mhc@gmail.com",
            weeks_delivered: "1",
            first_order_date: "7/12/2020",
        },
        {
            email: "nitabaptistac@gmail.com",
            weeks_delivered: "27",
            first_order_date: "7/13/2020",
        },
        {
            email: "tanyaknight4@gmail.com",
            weeks_delivered: "33",
            first_order_date: "7/13/2020",
        },
        {
            email: "ing.emiliolabal@gmail.com",
            weeks_delivered: "1",
            first_order_date: "7/16/2020",
        },
        {
            email: "ldavidson@asbarcelona.com",
            weeks_delivered: "63",
            first_order_date: "7/17/2020",
        },
        {
            email: "bikibarcelona@gmail.com",
            weeks_delivered: "7",
            first_order_date: "7/17/2020",
        },
        {
            email: "mklages93@gmail.com",
            weeks_delivered: "22",
            first_order_date: "7/18/2020",
        },
        {
            email: "nina.giannetto@gmail.com",
            weeks_delivered: "11",
            first_order_date: "7/19/2020",
        },
        {
            email: "rachaelbrand@msn.com",
            weeks_delivered: "1",
            first_order_date: "7/22/2020",
        },
        {
            email: "kim-vandekerckhove@hotmail.com",
            weeks_delivered: "26",
            first_order_date: "7/22/2020",
        },
        {
            email: "Barbie-337@hotmail.com",
            weeks_delivered: "41",
            first_order_date: "7/23/2020",
        },
        {
            email: "tiggr@gmx.li",
            weeks_delivered: "4",
            first_order_date: "7/23/2020",
        },
        {
            email: "alexander.ayres1@gmail.com",
            weeks_delivered: "19",
            first_order_date: "7/25/2020",
        },
        {
            email: "mguzmanvanreijn@gmail.com",
            weeks_delivered: "3",
            first_order_date: "7/26/2020",
        },
        {
            email: "gabriel.maeztu@gmail.com",
            weeks_delivered: "7",
            first_order_date: "7/29/2020",
        },
        {
            email: "bellaalyssalee@gmail.com",
            weeks_delivered: "18",
            first_order_date: "7/31/2020",
        },
        {
            email: "harelj6@gmail.com",
            weeks_delivered: "2",
            first_order_date: "8/1/2020",
        },
        {
            email: "florian-werner@web.de",
            weeks_delivered: "3",
            first_order_date: "8/6/2020",
        },
        {
            email: "maiconscosta@gmail.com",
            weeks_delivered: "32",
            first_order_date: "8/9/2020",
        },
        {
            email: "caritoru_08@hotmail.com",
            weeks_delivered: "35",
            first_order_date: "8/13/2020",
        },
        {
            email: "arthur_gsai@hotmail.com",
            weeks_delivered: "3",
            first_order_date: "8/14/2020",
        },
        {
            email: "lisaknelange@gmail.com",
            weeks_delivered: "15",
            first_order_date: "8/15/2020",
        },
        {
            email: "lara.yousuf83@gmail.com",
            weeks_delivered: "2",
            first_order_date: "8/15/2020",
        },
        {
            email: "holowarez@gmail.com",
            weeks_delivered: "27",
            first_order_date: "8/16/2020",
        },
        {
            email: "ashleyjean23@gmail.com",
            weeks_delivered: "27",
            first_order_date: "8/18/2020",
        },
        {
            email: "vileom@me.com",
            weeks_delivered: "9",
            first_order_date: "8/22/2020",
        },
        {
            email: "h_l_smith@yahoo.com",
            weeks_delivered: "8",
            first_order_date: "8/25/2020",
        },
        {
            email: "daniela.diazgranados@gmail.com",
            weeks_delivered: "15",
            first_order_date: "8/26/2020",
        },
        {
            email: "pepsyporer@yahoo.com",
            weeks_delivered: "3",
            first_order_date: "8/27/2020",
        },
        {
            email: "nataliabelenguer@gmail.com",
            weeks_delivered: "9",
            first_order_date: "8/27/2020",
        },
        {
            email: "tejarau19@gmail.com",
            weeks_delivered: "31",
            first_order_date: "8/28/2020",
        },
        {
            email: "voina.ovidiu@gmail.com",
            weeks_delivered: "1",
            first_order_date: "8/30/2020",
        },
        {
            email: "lysianendjock@gmail.com",
            weeks_delivered: "35",
            first_order_date: "8/30/2020",
        },
        {
            email: "aled@aleddavies.com",
            weeks_delivered: "26",
            first_order_date: "9/1/2020",
        },
        {
            email: "Elise.medica@gmail.com",
            weeks_delivered: "55",
            first_order_date: "9/1/2020",
        },
        {
            email: "t.schneider.1987@outlook.de",
            weeks_delivered: "6",
            first_order_date: "9/2/2020",
        },
        {
            email: "marlottezandwijk@hotmail.com",
            weeks_delivered: "49",
            first_order_date: "9/3/2020",
        },
        {
            email: "tomvk@gmx.de",
            weeks_delivered: "1",
            first_order_date: "9/3/2020",
        },
        {
            email: "infoprezii@gmail.com",
            weeks_delivered: "43",
            first_order_date: "9/3/2020",
        },
        {
            email: "olearteversatil@gmail.com",
            weeks_delivered: "21",
            first_order_date: "9/4/2020",
        },
        {
            email: "ceciliabarudi@tutanota.com",
            weeks_delivered: "53",
            first_order_date: "9/4/2020",
        },
        {
            email: "bestellungen@mattig.es",
            weeks_delivered: "48",
            first_order_date: "9/4/2020",
        },
        {
            email: "kharvkh49@gmail.com",
            weeks_delivered: "32",
            first_order_date: "9/5/2020",
        },
        {
            email: "lindsayrichardsforrest@gmail.com",
            weeks_delivered: "49",
            first_order_date: "9/6/2020",
        },
        {
            email: "thicomm@gmail.com",
            weeks_delivered: "6",
            first_order_date: "9/6/2020",
        },
        {
            email: "mvschneiderg@gmail.com",
            weeks_delivered: "1",
            first_order_date: "9/6/2020",
        },
        {
            email: "zorakovacic@gmail.com",
            weeks_delivered: "24",
            first_order_date: "9/6/2020",
        },
        {
            email: "vtallie@gmail.com",
            weeks_delivered: "25",
            first_order_date: "9/6/2020",
        },
        {
            email: "apullen12@gmail.com",
            weeks_delivered: "54",
            first_order_date: "9/7/2020",
        },
        {
            email: "jenny.furrer@hotmail.com",
            weeks_delivered: "2",
            first_order_date: "9/8/2020",
        },
        {
            email: "katjalegien@gmx.de",
            weeks_delivered: "50",
            first_order_date: "9/9/2020",
        },
        {
            email: "alenboro@yahoo.co.uk",
            weeks_delivered: "1",
            first_order_date: "9/9/2020",
        },
        {
            email: "da_kunz@yahoo.de",
            weeks_delivered: "56",
            first_order_date: "9/9/2020",
        },
        {
            email: "joan.caba@gmail.com",
            weeks_delivered: "2",
            first_order_date: "9/9/2020",
        },
        {
            email: "cmxdaily@gmail.com",
            weeks_delivered: "2",
            first_order_date: "9/14/2020",
        },
        {
            email: "mpleighty@gmail.com",
            weeks_delivered: "34",
            first_order_date: "9/14/2020",
        },
        {
            email: "mcgovern.t.r@gmail.com",
            weeks_delivered: "36",
            first_order_date: "9/14/2020",
        },
        {
            email: "matte_isabelle@yahoo.fr",
            weeks_delivered: "60",
            first_order_date: "9/15/2020",
        },
        {
            email: "mebond511@gmail.com",
            weeks_delivered: "5",
            first_order_date: "9/16/2020",
        },
        {
            email: "alizgr@gmail.com",
            weeks_delivered: "30",
            first_order_date: "9/17/2020",
        },
        {
            email: "pachu@global.t-bird.edu",
            weeks_delivered: "33",
            first_order_date: "9/17/2020",
        },
        {
            email: "inmamolina90@gmail.com",
            weeks_delivered: "1",
            first_order_date: "9/17/2020",
        },
        {
            email: "yonumonu@gmail.com",
            weeks_delivered: "35",
            first_order_date: "5/16/2021",
        },
        {
            email: "ssoydan@gmail.com",
            weeks_delivered: "50",
            first_order_date: "9/17/2020",
        },
        {
            email: "migyulli@hotmail.com",
            weeks_delivered: "11",
            first_order_date: "9/18/2020",
        },
        {
            email: "suuss1990@hotmail.com",
            weeks_delivered: "32",
            first_order_date: "9/18/2020",
        },
        {
            email: "maxime.gs@gmx.com",
            weeks_delivered: "49",
            first_order_date: "9/18/2020",
        },
        {
            email: "dominomi79@gmail.com",
            weeks_delivered: "39",
            first_order_date: "9/19/2020",
        },
        {
            email: "mariahelada@yahoo.es",
            weeks_delivered: "1",
            first_order_date: "9/20/2020",
        },
        {
            email: "pau.vergin@googlemail.com",
            weeks_delivered: "13",
            first_order_date: "9/21/2020",
        },
        {
            email: "ninaduysan@yahoo.fr",
            weeks_delivered: "1",
            first_order_date: "9/23/2020",
        },
        {
            email: "aly.a.bauer@gmail.com",
            weeks_delivered: "45",
            first_order_date: "9/23/2020",
        },
        {
            email: "pim.fakkeldij@sap.com",
            weeks_delivered: "2",
            first_order_date: "9/25/2020",
        },
        {
            email: "matiasmoraiz@gmail.com",
            weeks_delivered: "2",
            first_order_date: "9/25/2020",
        },
        {
            email: "Andi.onhaus@gmail.com",
            weeks_delivered: "38",
            first_order_date: "9/27/2020",
        },
        {
            email: "lauryn16smith@gmail.com",
            weeks_delivered: "12",
            first_order_date: "9/27/2020",
        },
        {
            email: "kelseydsheehan@gmail.com",
            weeks_delivered: "35",
            first_order_date: "9/27/2020",
        },
        {
            email: "irinabogorad@gmail.com",
            weeks_delivered: "13",
            first_order_date: "9/29/2020",
        },
        {
            email: "ashleighlapointe@hotmail.com",
            weeks_delivered: "7",
            first_order_date: "9/29/2020",
        },
        {
            email: "nadegebourdin@outlook.com",
            weeks_delivered: "15",
            first_order_date: "9/30/2020",
        },
        {
            email: "edgar.fando@gmail.com",
            weeks_delivered: "35",
            first_order_date: "10/1/2020",
        },
        {
            email: "ambar.herediah@gmail.com",
            weeks_delivered: "7",
            first_order_date: "10/1/2020",
        },
        {
            email: "thiel_melanie@gmx.de",
            weeks_delivered: "25",
            first_order_date: "10/2/2020",
        },
        {
            email: "ssvetlana818@gmail.com",
            weeks_delivered: "6",
            first_order_date: "10/2/2020",
        },
        {
            email: "danielaeiberle@gmail.com",
            weeks_delivered: "2",
            first_order_date: "10/2/2020",
        },
        {
            email: "justeenyc@gmail.com",
            weeks_delivered: "19",
            first_order_date: "10/2/2020",
        },
        {
            email: "munshi.nabeelah@gmail.com",
            weeks_delivered: "13",
            first_order_date: "10/2/2020",
        },
        {
            email: "lvermeulen@me.com",
            weeks_delivered: "5",
            first_order_date: "10/3/2020",
        },
        {
            email: "kleijntje@gmail.com",
            weeks_delivered: "11",
            first_order_date: "10/3/2020",
        },
        {
            email: "marian.ht@hotmail.com",
            weeks_delivered: "5",
            first_order_date: "10/4/2020",
        },
        {
            email: "siiri.lietu@gmail.com",
            weeks_delivered: "1",
            first_order_date: "10/6/2020",
        },
        {
            email: "skozinskaweb@gmail.com",
            weeks_delivered: "27",
            first_order_date: "10/7/2020",
        },
        {
            email: "awilliams.trading@gmail.com",
            weeks_delivered: "1",
            first_order_date: "10/7/2020",
        },
        {
            email: "gsamuel85@gmail.com",
            weeks_delivered: "44",
            first_order_date: "10/8/2020",
        },
        {
            email: "noshutdown@gmail.com",
            weeks_delivered: "39",
            first_order_date: "10/8/2020",
        },
        {
            email: "kelly@helivac.co.za",
            weeks_delivered: "38",
            first_order_date: "10/8/2020",
        },
        {
            email: "Helena-94@hotmail.co.uk",
            weeks_delivered: "1",
            first_order_date: "10/8/2020",
        },
        {
            email: "maurice_geheniau@hotmail.com",
            weeks_delivered: "11",
            first_order_date: "10/8/2020",
        },
        {
            email: "ariana.farsai@gmail.com",
            weeks_delivered: "17",
            first_order_date: "10/8/2020",
        },
        {
            email: "plara009@hotmail.com",
            weeks_delivered: "7",
            first_order_date: "10/9/2020",
        },
        {
            email: "mandimoo19@hotmail.com",
            weeks_delivered: "29",
            first_order_date: "10/9/2020",
        },
        {
            email: "karinfujimoto@gmail.com",
            weeks_delivered: "1",
            first_order_date: "10/9/2020",
        },
        {
            email: "toms.varpins@gmail.com",
            weeks_delivered: "19",
            first_order_date: "10/9/2020",
        },
        {
            email: "maria.fernandezds@gmail.com",
            weeks_delivered: "14",
            first_order_date: "10/9/2020",
        },
        {
            email: "max@kramer.es",
            weeks_delivered: "22",
            first_order_date: "10/11/2020",
        },
        {
            email: "romeo.lauren@gmail.com",
            weeks_delivered: "8",
            first_order_date: "10/12/2020",
        },
        {
            email: "daniils.suhovs@gmail.com",
            weeks_delivered: "6",
            first_order_date: "10/13/2020",
        },
        {
            email: "yarapaoli@gmail.com",
            weeks_delivered: "15",
            first_order_date: "10/14/2020",
        },
        {
            email: "mashagomez@gmail.com",
            weeks_delivered: "29",
            first_order_date: "10/14/2020",
        },
        {
            email: "cnvalencia14@gmail.com",
            weeks_delivered: "2",
            first_order_date: "10/15/2020",
        },
        {
            email: "guillnf@gmail.com",
            weeks_delivered: "2",
            first_order_date: "10/15/2020",
        },
        {
            email: "amandinedieval@gmail.com",
            weeks_delivered: "2",
            first_order_date: "10/15/2020",
        },
        {
            email: "taraboudreau0111@gmail.com",
            weeks_delivered: "29",
            first_order_date: "10/15/2020",
        },
        {
            email: "nflotats@alfatei.com",
            weeks_delivered: "1",
            first_order_date: "10/16/2020",
        },
        {
            email: "tawnie.farinez@gmail.com",
            weeks_delivered: "16",
            first_order_date: "10/16/2020",
        },
        {
            email: "antoine.eripret@gmail.com",
            weeks_delivered: "2",
            first_order_date: "10/16/2020",
        },
        {
            email: "emmy.lindstam@gmail.com",
            weeks_delivered: "39",
            first_order_date: "10/17/2020",
        },
        {
            email: "martaw.poczta@gmail.com",
            weeks_delivered: "17",
            first_order_date: "10/17/2020",
        },
        {
            email: "gabor.endre.ormos@gmail.com",
            weeks_delivered: "26",
            first_order_date: "10/18/2020",
        },
        {
            email: "david.a.king11@gmail.com",
            weeks_delivered: "1",
            first_order_date: "10/18/2020",
        },
        {
            email: "gillian.patterson@socialpoint.es",
            weeks_delivered: "15",
            first_order_date: "10/19/2020",
        },
        {
            email: "llazaro90@hotmail.com",
            weeks_delivered: "35",
            first_order_date: "10/19/2020",
        },
        {
            email: "mdomen14@xtec.cat",
            weeks_delivered: "3",
            first_order_date: "10/20/2020",
        },
        {
            email: "carolinamahia@outlook.com",
            weeks_delivered: "37",
            first_order_date: "10/20/2020",
        },
        {
            email: "saskiarj@gmail.com",
            weeks_delivered: "3",
            first_order_date: "10/21/2020",
        },
        {
            email: "sbustio@hotmail.com",
            weeks_delivered: "27",
            first_order_date: "10/22/2020",
        },
        {
            email: "jeangoutceline@gmail.com",
            weeks_delivered: "1",
            first_order_date: "10/22/2020",
        },
        {
            email: "paszkiewiczpamela@yahoo.ie",
            weeks_delivered: "1",
            first_order_date: "10/22/2020",
        },
        {
            email: "froque@asbarcelona.com",
            weeks_delivered: "35",
            first_order_date: "10/23/2020",
        },
        {
            email: "juanhernandezesesoyyo@gmail.com",
            weeks_delivered: "3",
            first_order_date: "10/23/2020",
        },
        {
            email: "olgazhakova@yahoo.com",
            weeks_delivered: "26",
            first_order_date: "10/23/2020",
        },
        {
            email: "renatarene948@gmail.com",
            weeks_delivered: "3",
            first_order_date: "10/23/2020",
        },
        {
            email: "hslockwood@gmail.com",
            weeks_delivered: "49",
            first_order_date: "10/24/2020",
        },
        {
            email: "rltracy29@gmail.com",
            weeks_delivered: "55",
            first_order_date: "10/25/2020",
        },
        {
            email: "iska@ifigroup.it",
            weeks_delivered: "27",
            first_order_date: "10/26/2020",
        },
        {
            email: "louboillod@gmail.com",
            weeks_delivered: "1",
            first_order_date: "10/27/2020",
        },
        {
            email: "ursula.thibault@gmail.com",
            weeks_delivered: "54",
            first_order_date: "10/28/2020",
        },
        {
            email: "sashawood2017@gmail.com",
            weeks_delivered: "38",
            first_order_date: "10/28/2020",
        },
        {
            email: "alexandra.vall.rojo@gmail.com",
            weeks_delivered: "25",
            first_order_date: "10/28/2020",
        },
        {
            email: "valera.manu@gmail.com",
            weeks_delivered: "2",
            first_order_date: "10/28/2020",
        },
        {
            email: "jannes.wigerinck@hotmail.com",
            weeks_delivered: "7",
            first_order_date: "10/29/2020",
        },
        {
            email: "amranigonzalezlaila@gmail.com",
            weeks_delivered: "1",
            first_order_date: "10/29/2020",
        },
        {
            email: "fetchebarne@gmail.com",
            weeks_delivered: "2",
            first_order_date: "10/30/2020",
        },
        {
            email: "fel.ledesma@gmail.com",
            weeks_delivered: "3",
            first_order_date: "10/30/2020",
        },
        {
            email: "liurika@hotmail.com",
            weeks_delivered: "15",
            first_order_date: "10/31/2020",
        },
        {
            email: "kaitlinkemp@gmail.com",
            weeks_delivered: "7",
            first_order_date: "10/31/2020",
        },
        {
            email: "ampafla@gmail.com",
            weeks_delivered: "3",
            first_order_date: "10/31/2020",
        },
        {
            email: "vansatri@hotmail.com",
            weeks_delivered: "12",
            first_order_date: "11/1/2020",
        },
        {
            email: "flaquefrancisca@gmail.com",
            weeks_delivered: "4",
            first_order_date: "11/1/2020",
        },
        {
            email: "evandroccarmo@gmail.com",
            weeks_delivered: "23",
            first_order_date: "11/2/2020",
        },
        {
            email: "helmy.cc@gmail.com",
            weeks_delivered: "45",
            first_order_date: "11/2/2020",
        },
        {
            email: "Lorena.blickhaeuser@yahoo.de",
            weeks_delivered: "30",
            first_order_date: "11/3/2020",
        },
        {
            email: "annekagonzalezinga@gmail.com",
            weeks_delivered: "7",
            first_order_date: "11/3/2020",
        },
        {
            email: "richard@gargan.com",
            weeks_delivered: "47",
            first_order_date: "11/3/2020",
        },
        {
            email: "emetzeitz@gmail.com",
            weeks_delivered: "5",
            first_order_date: "11/4/2020",
        },
        {
            email: "amypoor3@gmail.com",
            weeks_delivered: "31",
            first_order_date: "11/4/2020",
        },
        {
            email: "cnegrerosell@gmail.com",
            weeks_delivered: "33",
            first_order_date: "11/5/2020",
        },
        {
            email: "gabenemail@gmail.com",
            weeks_delivered: "1",
            first_order_date: "11/5/2020",
        },
        {
            email: "lizoswald@gmail.com",
            weeks_delivered: "9",
            first_order_date: "11/5/2020",
        },
        {
            email: "joannaprzewlocka@wp.pl",
            weeks_delivered: "56",
            first_order_date: "11/5/2020",
        },
        {
            email: "agnieszka.cymler@ymail.com",
            weeks_delivered: "19",
            first_order_date: "11/5/2020",
        },
        {
            email: "osknoes@gmail.com",
            weeks_delivered: "1",
            first_order_date: "11/6/2020",
        },
        {
            email: "sebiheinath@gmail.com",
            weeks_delivered: "6",
            first_order_date: "11/7/2020",
        },
        {
            email: "arturo.madrid@gmail.com",
            weeks_delivered: "3",
            first_order_date: "11/8/2020",
        },
        {
            email: "missangemarie@hotmail.com",
            weeks_delivered: "11",
            first_order_date: "11/8/2020",
        },
        {
            email: "porto.vga@gmail.com",
            weeks_delivered: "16",
            first_order_date: "11/8/2020",
        },
        {
            email: "dmitrii.riabukha@gmail.com",
            weeks_delivered: "1",
            first_order_date: "11/9/2020",
        },
        {
            email: "montpinyol@hotmail.com",
            weeks_delivered: "29",
            first_order_date: "11/9/2020",
        },
        {
            email: "b.reduce@gmail.com",
            weeks_delivered: "2",
            first_order_date: "11/9/2020",
        },
        {
            email: "kay_jeffrey@hotmail.com",
            weeks_delivered: "31",
            first_order_date: "11/9/2020",
        },
        {
            email: "RACHEL_D6@HOTMAIL.COM",
            weeks_delivered: "51",
            first_order_date: "11/10/2020",
        },
        {
            email: "mariasimoricart@gmail.com",
            weeks_delivered: "2",
            first_order_date: "11/11/2020",
        },
        {
            email: "javier.mas93@gmail.com",
            weeks_delivered: "2",
            first_order_date: "11/12/2020",
        },
        {
            email: "sarramechri@hotmail.com",
            weeks_delivered: "1",
            first_order_date: "11/13/2020",
        },
        {
            email: "julissakiyenje@gmail.com",
            weeks_delivered: "34",
            first_order_date: "11/13/2020",
        },
        {
            email: "alexandra@aletras.com",
            weeks_delivered: "39",
            first_order_date: "11/13/2020",
        },
        {
            email: "lusouza.and@gmail.com",
            weeks_delivered: "4",
            first_order_date: "11/13/2020",
        },
        {
            email: "Dimitri.spolspoel@gmail.com",
            weeks_delivered: "13",
            first_order_date: "11/13/2020",
        },
        {
            email: "flavia.trinidad@gmail.com",
            weeks_delivered: "21",
            first_order_date: "11/14/2020",
        },
        {
            email: "ella.lane15@outlook.com",
            weeks_delivered: "20",
            first_order_date: "11/14/2020",
        },
        {
            email: "alejandra.banay@gmail.com",
            weeks_delivered: "1",
            first_order_date: "11/16/2020",
        },
        {
            email: "jaz.vuytrea@gmail.com",
            weeks_delivered: "28",
            first_order_date: "11/17/2020",
        },
        {
            email: "carrielillie@gmail.com",
            weeks_delivered: "3",
            first_order_date: "11/17/2020",
        },
        {
            email: "mariecorbais@gmail.com",
            weeks_delivered: "1",
            first_order_date: "11/17/2020",
        },
        {
            email: "lupu_gabriela83@hotmail.es",
            weeks_delivered: "12",
            first_order_date: "11/18/2020",
        },
        {
            email: "shawnkyzer@gmail.com",
            weeks_delivered: "30",
            first_order_date: "11/19/2020",
        },
        {
            email: "marie.graf@hotmail.de",
            weeks_delivered: "1",
            first_order_date: "11/19/2020",
        },
        {
            email: "alawless@es-school.com",
            weeks_delivered: "12",
            first_order_date: "11/19/2020",
        },
        {
            email: "joshcaterham@gmail.com",
            weeks_delivered: "2",
            first_order_date: "11/19/2020",
        },
        {
            email: "annagr2002@gmail.com",
            weeks_delivered: "8",
            first_order_date: "11/19/2020",
        },
        {
            email: "riqui1993@gmail.com",
            weeks_delivered: "1",
            first_order_date: "11/19/2020",
        },
        {
            email: "lucie.rosa.lanham@gmail.com",
            weeks_delivered: "8",
            first_order_date: "11/19/2020",
        },
        {
            email: "jabogo96@gmail.com",
            weeks_delivered: "1",
            first_order_date: "11/20/2020",
        },
        {
            email: "farmijo16@gmail.com",
            weeks_delivered: "6",
            first_order_date: "11/20/2020",
        },
        {
            email: "davidibanezsiguero@gmail.com",
            weeks_delivered: "8",
            first_order_date: "11/21/2020",
        },
        {
            email: "henry.schafer.harrison@gmail.com",
            weeks_delivered: "27",
            first_order_date: "11/21/2020",
        },
        {
            email: "galibelle.barcelona.arenas@gmail.com",
            weeks_delivered: "30",
            first_order_date: "11/22/2020",
        },
        {
            email: "f.artigasventola@gmail.com",
            weeks_delivered: "1",
            first_order_date: "11/22/2020",
        },
        {
            email: "jolantasz17@gmail.com",
            weeks_delivered: "6",
            first_order_date: "11/22/2020",
        },
        {
            email: "amirdov@gmail.com",
            weeks_delivered: "4",
            first_order_date: "11/23/2020",
        },
        {
            email: "noemiecmichot@gmail.com",
            weeks_delivered: "1",
            first_order_date: "11/24/2020",
        },
        {
            email: "ague15j@gmail.com",
            weeks_delivered: "16",
            first_order_date: "11/24/2020",
        },
        {
            email: "lucave48@gmail.com",
            weeks_delivered: "1",
            first_order_date: "11/22/2020",
        },
        {
            email: "benjaminlefebvre@hotmail.de",
            weeks_delivered: "1",
            first_order_date: "11/26/2020",
        },
        {
            email: "gbarreracastillo@gmail.com",
            weeks_delivered: "2",
            first_order_date: "11/26/2020",
        },
        {
            email: "anastasiaplotnikova94@gmail.com",
            weeks_delivered: "14",
            first_order_date: "11/26/2020",
        },
        {
            email: "pedro.benka@gmail.com",
            weeks_delivered: "42",
            first_order_date: "11/27/2020",
        },
        {
            email: "sara.orozco83@gmail.com",
            weeks_delivered: "1",
            first_order_date: "11/28/2020",
        },
        {
            email: "varasnuria@gmail.com",
            weeks_delivered: "44",
            first_order_date: "11/28/2020",
        },
        {
            email: "susannengelhardt@aol.com",
            weeks_delivered: "6",
            first_order_date: "11/29/2020",
        },
        {
            email: "ramirobarbero@hotmail.com",
            weeks_delivered: "1",
            first_order_date: "11/30/2020",
        },
        {
            email: "natalia.sacilotto@gmail.com",
            weeks_delivered: "32",
            first_order_date: "11/30/2020",
        },
        {
            email: "toniherrerazurita@gmail.com",
            weeks_delivered: "24",
            first_order_date: "12/1/2020",
        },
        {
            email: "bruno.deluiggi@iese.net",
            weeks_delivered: "5",
            first_order_date: "12/1/2020",
        },
        {
            email: "roi.driscoll@gmail.com",
            weeks_delivered: "1",
            first_order_date: "12/1/2020",
        },
        {
            email: "raquelrag@gmail.com",
            weeks_delivered: "46",
            first_order_date: "12/3/2020",
        },
        {
            email: "naticarta@hotmail.com",
            weeks_delivered: "1",
            first_order_date: "12/4/2020",
        },
        {
            email: "rvrunckel@gmail.com",
            weeks_delivered: "1",
            first_order_date: "12/4/2020",
        },
        {
            email: "suzannevanbrunschot76@gmail.com",
            weeks_delivered: "25",
            first_order_date: "12/6/2020",
        },
        {
            email: "plassart@gmail.com",
            weeks_delivered: "40",
            first_order_date: "12/6/2020",
        },
        {
            email: "teo.voire@gmail.com",
            weeks_delivered: "1",
            first_order_date: "12/7/2020",
        },
        {
            email: "craig.halgreen@gmail.com",
            weeks_delivered: "3",
            first_order_date: "12/8/2020",
        },
        {
            email: "wustmateo@gmail.com",
            weeks_delivered: "19",
            first_order_date: "12/8/2020",
        },
        {
            email: "shamousk@gmail.com",
            weeks_delivered: "22",
            first_order_date: "12/9/2020",
        },
        {
            email: "jvoare@suecos.com",
            weeks_delivered: "33",
            first_order_date: "12/10/2020",
        },
        {
            email: "a.garcia.just@gmail.com",
            weeks_delivered: "24",
            first_order_date: "12/11/2020",
        },
        {
            email: "zureikat@gmail.com",
            weeks_delivered: "2",
            first_order_date: "12/12/2020",
        },
        {
            email: "juarezinsf@gmail.com",
            weeks_delivered: "15",
            first_order_date: "12/14/2020",
        },
        {
            email: "daniela.eriksson@live.co.uk",
            weeks_delivered: "1",
            first_order_date: "12/14/2020",
        },
        {
            email: "emilyvholgate@gmail.com",
            weeks_delivered: "35",
            first_order_date: "12/15/2020",
        },
        {
            email: "m4rklar@gmail.com",
            weeks_delivered: "25",
            first_order_date: "12/17/2020",
        },
        {
            email: "janet.rios1663@gmail.com",
            weeks_delivered: "15",
            first_order_date: "12/17/2020",
        },
        {
            email: "nuyilprods@gmail.com",
            weeks_delivered: "21",
            first_order_date: "12/27/2020",
        },
        {
            email: "eynelpilatowsky@gmail.com",
            weeks_delivered: "43",
            first_order_date: "12/29/2020",
        },
        {
            email: "sophievingham@gmail.com",
            weeks_delivered: "1",
            first_order_date: "12/30/2020",
        },
        {
            email: "contact@pieterbailleul.be",
            weeks_delivered: "39",
            first_order_date: "1/2/2021",
        },
        {
            email: "parry.my@gmail.com",
            weeks_delivered: "18",
            first_order_date: "1/3/2021",
        },
        {
            email: "laetitiamartinot@gmail.com",
            weeks_delivered: "16",
            first_order_date: "1/3/2021",
        },
        {
            email: "gassol.isaac@gmail.com",
            weeks_delivered: "16",
            first_order_date: "1/4/2021",
        },
        {
            email: "capucinednnt@gmail.com",
            weeks_delivered: "1",
            first_order_date: "1/5/2021",
        },
        {
            email: "pipe_4@hotmail.com",
            weeks_delivered: "1",
            first_order_date: "1/5/2021",
        },
        {
            email: "lebeau.thomas@gmail.com",
            weeks_delivered: "20",
            first_order_date: "1/7/2021",
        },
        {
            email: "lukas.tanzmayr@gmail.com",
            weeks_delivered: "1",
            first_order_date: "1/7/2021",
        },
        {
            email: "emmanuel.cabane@gmail.com",
            weeks_delivered: "1",
            first_order_date: "1/7/2021",
        },
        {
            email: "beiiby@gmail.com",
            weeks_delivered: "1",
            first_order_date: "1/8/2021",
        },
        {
            email: "llibert.carbonell@gmail.com",
            weeks_delivered: "46",
            first_order_date: "1/9/2021",
        },
        {
            email: "milenegq@gmail.com",
            weeks_delivered: "4",
            first_order_date: "1/9/2021",
        },
        {
            email: "adnaxls@gmail.com",
            weeks_delivered: "9",
            first_order_date: "1/10/2021",
        },
        {
            email: "gnettleton@gmail.com",
            weeks_delivered: "2",
            first_order_date: "1/10/2021",
        },
        {
            email: "craig@bovis.me.uk",
            weeks_delivered: "36",
            first_order_date: "1/11/2021",
        },
        {
            email: "hannah.barnes@ogilvy.com",
            weeks_delivered: "3",
            first_order_date: "1/11/2021",
        },
        {
            email: "andresgil_1992@hotmail.com",
            weeks_delivered: "1",
            first_order_date: "1/11/2021",
        },
        {
            email: "Hauer.lena.lh@gmail.com",
            weeks_delivered: "2",
            first_order_date: "1/11/2021",
        },
        {
            email: "jana.hernandez.araujo@gmail.com",
            weeks_delivered: "12",
            first_order_date: "1/11/2021",
        },
        {
            email: "vickyw87@hotmail.com",
            weeks_delivered: "14",
            first_order_date: "1/12/2021",
        },
        {
            email: "charlinepoullet@hotmail.com",
            weeks_delivered: "16",
            first_order_date: "1/22/2021",
        },
        {
            email: "Jonathan_verlaak@hotmail.com",
            weeks_delivered: "1",
            first_order_date: "1/15/2021",
        },
        {
            email: "john.clark128@gmail.com",
            weeks_delivered: "28",
            first_order_date: "1/15/2021",
        },
        {
            email: "fbargo94@gmail.com",
            weeks_delivered: "11",
            first_order_date: "1/17/2021",
        },
        {
            email: "ollyblom@gmail.com",
            weeks_delivered: "36",
            first_order_date: "1/17/2021",
        },
        {
            email: "eva.groot@hotmail.com",
            weeks_delivered: "2",
            first_order_date: "1/17/2021",
        },
        {
            email: "tg.pick92@gmail.com",
            weeks_delivered: "2",
            first_order_date: "1/18/2021",
        },
        {
            email: "hi@baran.fyi",
            weeks_delivered: "11",
            first_order_date: "1/18/2021",
        },
        {
            email: "m.londono.clayton@gmail.com",
            weeks_delivered: "2",
            first_order_date: "1/19/2021",
        },
        {
            email: "helene.fluit@gmail.com",
            weeks_delivered: "3",
            first_order_date: "1/19/2021",
        },
        {
            email: "hbarclay229@gmail.com",
            weeks_delivered: "42",
            first_order_date: "1/20/2021",
        },
        {
            email: "Keijer@hotmail.com",
            weeks_delivered: "38",
            first_order_date: "1/20/2021",
        },
        {
            email: "allalala2012@gmail.com",
            weeks_delivered: "21",
            first_order_date: "1/21/2021",
        },
        {
            email: "valeria-2000@mail.ru",
            weeks_delivered: "22",
            first_order_date: "1/22/2021",
        },
        {
            email: "matthew.pattemore@gmail.com",
            weeks_delivered: "1",
            first_order_date: "1/23/2021",
        },
        {
            email: "juliavreintaal@gmail.com",
            weeks_delivered: "11",
            first_order_date: "1/23/2021",
        },
        {
            email: "paulcoghill@mac.com",
            weeks_delivered: "6",
            first_order_date: "1/24/2021",
        },
        {
            email: "daan0dj@gmail.com",
            weeks_delivered: "30",
            first_order_date: "1/24/2021",
        },
        {
            email: "anaiscarolina.ortega@e-campus.uab.cat",
            weeks_delivered: "1",
            first_order_date: "1/25/2021",
        },
        {
            email: "benedicte.jacquet@hotmail.fr",
            weeks_delivered: "22",
            first_order_date: "1/25/2021",
        },
        {
            email: "asbolsheva@inbox.ru",
            weeks_delivered: "1",
            first_order_date: "1/25/2021",
        },
        {
            email: "selvan.senthilkumaran@omt.org.uk",
            weeks_delivered: "17",
            first_order_date: "1/25/2021",
        },
        {
            email: "paulasmit13@gmail.com",
            weeks_delivered: "32",
            first_order_date: "1/25/2021",
        },
        {
            email: "lukas.kahler@outlook.com",
            weeks_delivered: "24",
            first_order_date: "1/27/2021",
        },
        {
            email: "susanavtg@gmail.com",
            weeks_delivered: "2",
            first_order_date: "1/28/2021",
        },
        {
            email: "liz8g@hotmail.com",
            weeks_delivered: "22",
            first_order_date: "1/28/2021",
        },
        {
            email: "alonsu@gmail.com",
            weeks_delivered: "9",
            first_order_date: "1/29/2021",
        },
        {
            email: "Julievdlande@gmail.com",
            weeks_delivered: "16",
            first_order_date: "1/30/2021",
        },
        {
            email: "natalianur85@gmail.com",
            weeks_delivered: "1",
            first_order_date: "1/30/2021",
        },
        {
            email: "aleselbaum@hotmail.com",
            weeks_delivered: "38",
            first_order_date: "1/31/2021",
        },
        {
            email: "danesgreg@gmail.com",
            weeks_delivered: "40",
            first_order_date: "2/1/2021",
        },
        {
            email: "catherineannepatterson@gmail.com",
            weeks_delivered: "24",
            first_order_date: "2/1/2021",
        },
        {
            email: "matt@stripemedia.com.au",
            weeks_delivered: "2",
            first_order_date: "2/1/2021",
        },
        {
            email: "s.morales1994@gmail.com",
            weeks_delivered: "9",
            first_order_date: "2/4/2021",
        },
        {
            email: "slopez@aelixtherapeutics.com",
            weeks_delivered: "15",
            first_order_date: "2/5/2021",
        },
        {
            email: "nizuqu@gmail.com",
            weeks_delivered: "3",
            first_order_date: "2/5/2021",
        },
        {
            email: "kalinaboukova@gmail.com",
            weeks_delivered: "1",
            first_order_date: "2/5/2021",
        },
        {
            email: "amber.r.rucker@gmail.com",
            weeks_delivered: "6",
            first_order_date: "2/9/2021",
        },
        {
            email: "silvia.stockman@gmail.com",
            weeks_delivered: "34",
            first_order_date: "2/9/2021",
        },
        {
            email: "amylaurenbarnes@gmail.com",
            weeks_delivered: "5",
            first_order_date: "2/9/2021",
        },
        {
            email: "idoiagarriz@gmail.com",
            weeks_delivered: "1",
            first_order_date: "2/9/2021",
        },
        {
            email: "ricardo.rosa@bayer.com",
            weeks_delivered: "1",
            first_order_date: "2/9/2021",
        },
        {
            email: "rosita.cordasco@gmail.com",
            weeks_delivered: "5",
            first_order_date: "2/10/2021",
        },
        {
            email: "sandravanrijt@hotmail.com",
            weeks_delivered: "1",
            first_order_date: "2/10/2021",
        },
        {
            email: "chloe.logeais@yahoo.fr",
            weeks_delivered: "23",
            first_order_date: "2/11/2021",
        },
        {
            email: "josedjeredjian@gmail.com",
            weeks_delivered: "7",
            first_order_date: "2/11/2021",
        },
        {
            email: "patricia.lopez.lopez@gmail.com",
            weeks_delivered: "16",
            first_order_date: "2/13/2021",
        },
        {
            email: "richard.charlton@socialpoint.es",
            weeks_delivered: "6",
            first_order_date: "2/14/2021",
        },
        {
            email: "daairun@hotmail.com",
            weeks_delivered: "10",
            first_order_date: "2/14/2021",
        },
        {
            email: "ft.marianaferreira@gmail.com",
            weeks_delivered: "1",
            first_order_date: "2/15/2021",
        },
        {
            email: "jhargrove95@gmail.com",
            weeks_delivered: "5",
            first_order_date: "2/15/2021",
        },
        {
            email: "irissmeekes@live.nl",
            weeks_delivered: "30",
            first_order_date: "2/15/2021",
        },
        {
            email: "carvmar82@gmail.com",
            weeks_delivered: "2",
            first_order_date: "2/16/2021",
        },
        {
            email: "nagels97@live.dk",
            weeks_delivered: "22",
            first_order_date: "10/29/2019",
        },
        {
            email: "mlopezr@tauli.cat",
            weeks_delivered: "12",
            first_order_date: "2/21/2021",
        },
        {
            email: "jasper.paterson@icloud.com",
            weeks_delivered: "1",
            first_order_date: "2/21/2021",
        },
        {
            email: "joshfeldberg@gmail.com",
            weeks_delivered: "2",
            first_order_date: "2/22/2021",
        },
        {
            email: "wilhelm.s.randers@gmail.com",
            weeks_delivered: "4",
            first_order_date: "2/22/2021",
        },
        {
            email: "rony.fadel@gmail.com",
            weeks_delivered: "2",
            first_order_date: "2/22/2021",
        },
        {
            email: "ANNAMARIAH94@GMAIL.COM",
            weeks_delivered: "3",
            first_order_date: "2/23/2021",
        },
        {
            email: "segard.helene@gmail.com",
            weeks_delivered: "11",
            first_order_date: "2/23/2021",
        },
        {
            email: "anna@francesch.com",
            weeks_delivered: "1",
            first_order_date: "2/23/2021",
        },
        {
            email: "silvia.castane@gmail.com",
            weeks_delivered: "14",
            first_order_date: "2/23/2021",
        },
        {
            email: "oscarjzc6@gmail.com",
            weeks_delivered: "1",
            first_order_date: "2/24/2021",
        },
        {
            email: "bendinat2@gmail.com",
            weeks_delivered: "9",
            first_order_date: "2/24/2021",
        },
        {
            email: "j.laute3@googlemail.com",
            weeks_delivered: "3",
            first_order_date: "2/24/2021",
        },
        {
            email: "minibooteille@gmail.com",
            weeks_delivered: "1",
            first_order_date: "2/26/2021",
        },
        {
            email: "joniandervishi@gmail.com",
            weeks_delivered: "19",
            first_order_date: "2/28/2021",
        },
        {
            email: "sdeberail@gmail.com",
            weeks_delivered: "9",
            first_order_date: "2/28/2021",
        },
        {
            email: "cedawkins@gmail.com",
            weeks_delivered: "6",
            first_order_date: "2/28/2021",
        },
        {
            email: "doctorfemke@yahoo.com",
            weeks_delivered: "20",
            first_order_date: "2/28/2021",
        },
        {
            email: "justynka.s@gmail.com",
            weeks_delivered: "1",
            first_order_date: "3/2/2021",
        },
        {
            email: "m.junkersvensson@hotmail.com",
            weeks_delivered: "7",
            first_order_date: "2/28/2021",
        },
        {
            email: "perillopersonal@gmail.com",
            weeks_delivered: "2",
            first_order_date: "3/1/2021",
        },
        {
            email: "mfatimavillegas@gmail.com",
            weeks_delivered: "43",
            first_order_date: "3/2/2021",
        },
        {
            email: "asliyuruk90@gmail.com",
            weeks_delivered: "1",
            first_order_date: "3/4/2021",
        },
        {
            email: "gioialue@gmail.com",
            weeks_delivered: "32",
            first_order_date: "3/4/2021",
        },
        {
            email: "roelien_de_boer@hotmail.com",
            weeks_delivered: "19",
            first_order_date: "3/7/2021",
        },
        {
            email: "jaredair@gmail.com",
            weeks_delivered: "5",
            first_order_date: "3/7/2021",
        },
        {
            email: "fguillaj@gmail.com",
            weeks_delivered: "2",
            first_order_date: "3/7/2021",
        },
        {
            email: "cillalavoie@gmail.com",
            weeks_delivered: "22",
            first_order_date: "3/8/2021",
        },
        {
            email: "alfredoelejalde@gmail.com",
            weeks_delivered: "2",
            first_order_date: "3/9/2021",
        },
        {
            email: "jp@mathi.eu",
            weeks_delivered: "2",
            first_order_date: "3/9/2021",
        },
        {
            email: "louesp19@hotmail.com",
            weeks_delivered: "39",
            first_order_date: "3/9/2021",
        },
        {
            email: "vcnicholas@gmail.com",
            weeks_delivered: "1",
            first_order_date: "3/9/2021",
        },
        {
            email: "paula.james78@gmail.com",
            weeks_delivered: "18",
            first_order_date: "3/9/2021",
        },
        {
            email: "diana_juarez@hotmail.com",
            weeks_delivered: "15",
            first_order_date: "3/11/2021",
        },
        {
            email: "belkin.k@gmail.com",
            weeks_delivered: "1",
            first_order_date: "3/11/2021",
        },
        {
            email: "c.davidtorresnunez@gmail.com",
            weeks_delivered: "2",
            first_order_date: "3/11/2021",
        },
        {
            email: "dina.bojanic@gmail.com",
            weeks_delivered: "7",
            first_order_date: "3/11/2021",
        },
        {
            email: "montsemarimon1@gmail.com",
            weeks_delivered: "17",
            first_order_date: "3/14/2021",
        },
        {
            email: "lizi_rom@hotmail.com",
            weeks_delivered: "34",
            first_order_date: "3/14/2021",
        },
        {
            email: "cm.munoz90@gmail.com",
            weeks_delivered: "17",
            first_order_date: "3/14/2021",
        },
        {
            email: "evaclaudi@gmail.com",
            weeks_delivered: "1",
            first_order_date: "3/14/2021",
        },
        {
            email: "apieceoface@gmail.com",
            weeks_delivered: "2",
            first_order_date: "3/15/2021",
        },
        {
            email: "marianak87@hotmail.com",
            weeks_delivered: "1",
            first_order_date: "3/16/2021",
        },
        {
            email: "becajaty@gmail.com",
            weeks_delivered: "35",
            first_order_date: "3/16/2021",
        },
        {
            email: "ajhinchliffe92@gmail.com",
            weeks_delivered: "18",
            first_order_date: "3/17/2021",
        },
        {
            email: "maria.matecna@gmail.com",
            weeks_delivered: "1",
            first_order_date: "3/17/2021",
        },
        {
            email: "edward.macgregor@gmail.com",
            weeks_delivered: "1",
            first_order_date: "3/17/2021",
        },
        {
            email: "inexplicabled@gmail.com",
            weeks_delivered: "33",
            first_order_date: "3/18/2021",
        },
        {
            email: "bryer22@gmail.com",
            weeks_delivered: "3",
            first_order_date: "3/19/2021",
        },
        {
            email: "qwerty.amith@gmail.com",
            weeks_delivered: "3",
            first_order_date: "3/21/2021",
        },
        {
            email: "ari.freixa5@gmail.com",
            weeks_delivered: "19",
            first_order_date: "3/21/2021",
        },
        {
            email: "evacoratella@gmail.com",
            weeks_delivered: "3",
            first_order_date: "3/21/2021",
        },
        {
            email: "oezlemkaymak@gmail.com",
            weeks_delivered: "8",
            first_order_date: "3/23/2021",
        },
        {
            email: "mariadelmar.ordonez@gmail.com",
            weeks_delivered: "1",
            first_order_date: "3/24/2021",
        },
        {
            email: "femke_guldemond@hotmail.com",
            weeks_delivered: "3",
            first_order_date: "3/24/2021",
        },
        {
            email: "hugo.mm.magalhaes+lc@gmail.com",
            weeks_delivered: "33",
            first_order_date: "3/28/2021",
        },
        {
            email: "roberto.cerquetani@googlemail.com",
            weeks_delivered: "1",
            first_order_date: "3/29/2021",
        },
        {
            email: "quirine@quirine.es",
            weeks_delivered: "22",
            first_order_date: "3/29/2021",
        },
        {
            email: "marionbalinoff@gmail.com",
            weeks_delivered: "2",
            first_order_date: "3/29/2021",
        },
        {
            email: "dmitry.vecheruk@gmail.com",
            weeks_delivered: "1",
            first_order_date: "3/29/2021",
        },
        {
            email: "susanjnell@gmail.com",
            weeks_delivered: "18",
            first_order_date: "3/30/2021",
        },
        {
            email: "ignasi.riviere@gmail.com",
            weeks_delivered: "13",
            first_order_date: "3/31/2021",
        },
        {
            email: "mfoyaca@gmail.com",
            weeks_delivered: "18",
            first_order_date: "3/31/2021",
        },
        {
            email: "ariane.simonelis@gmail.com",
            weeks_delivered: "1",
            first_order_date: "3/31/2021",
        },
        {
            email: "dccarmo@gmail.com",
            weeks_delivered: "12",
            first_order_date: "4/1/2021",
        },
        {
            email: "beata.anna.jaskula@gmail.com",
            weeks_delivered: "20",
            first_order_date: "4/1/2021",
        },
        {
            email: "vinicius@horewi.cz",
            weeks_delivered: "4",
            first_order_date: "4/2/2021",
        },
        {
            email: "oscarmontserratprat@gmail.com",
            weeks_delivered: "13",
            first_order_date: "4/6/2021",
        },
        {
            email: "alicia-carrillo@hotmail.com",
            weeks_delivered: "9",
            first_order_date: "4/6/2021",
        },
        {
            email: "vicky_picis@hotmail.com",
            weeks_delivered: "4",
            first_order_date: "4/6/2021",
        },
        {
            email: "sam.moyse@gmail.com",
            weeks_delivered: "28",
            first_order_date: "4/7/2021",
        },
        {
            email: "lbardaji@bbabogadas.com",
            weeks_delivered: "36",
            first_order_date: "4/7/2021",
        },
        {
            email: "jose.camacho@ubisoft.com",
            weeks_delivered: "18",
            first_order_date: "4/8/2021",
        },
        {
            email: "mcotton81@yahoo.com",
            weeks_delivered: "5",
            first_order_date: "4/8/2021",
        },
        {
            email: "coppinmarjorie@orange.fr",
            weeks_delivered: "5",
            first_order_date: "4/9/2021",
        },
        {
            email: "sbardoula93@gmail.com",
            weeks_delivered: "1",
            first_order_date: "4/9/2021",
        },
        {
            email: "kruasanchik698@gmail.com",
            weeks_delivered: "1",
            first_order_date: "4/11/2021",
        },
        {
            email: "juanestebanp94@gmail.com",
            weeks_delivered: "2",
            first_order_date: "4/12/2021",
        },
        {
            email: "saskia_van_der_hoeven@hotmail.com",
            weeks_delivered: "8",
            first_order_date: "4/13/2021",
        },
        {
            email: "varkoly.dora@gmail.com",
            weeks_delivered: "12",
            first_order_date: "4/14/2021",
        },
        {
            email: "daniel.gwercher@me.com",
            weeks_delivered: "2",
            first_order_date: "4/13/2021",
        },
        {
            email: "luisjaner8@gmail.com",
            weeks_delivered: "1",
            first_order_date: "4/15/2021",
        },
        {
            email: "fcabal.indecosa@gmail.com",
            weeks_delivered: "2",
            first_order_date: "4/15/2021",
        },
        {
            email: "dora.lacey@gmail.com",
            weeks_delivered: "7",
            first_order_date: "4/15/2021",
        },
        {
            email: "waldo.m@gmail.com",
            weeks_delivered: "1",
            first_order_date: "4/15/2021",
        },
        {
            email: "mmr9731@rit.edu",
            weeks_delivered: "2",
            first_order_date: "4/15/2021",
        },
        {
            email: "ovendrell@icab.cat",
            weeks_delivered: "9",
            first_order_date: "4/15/2021",
        },
        {
            email: "rociobsanchez@gmail.com",
            weeks_delivered: "33",
            first_order_date: "4/21/2021",
        },
        {
            email: "am.giraldo77@gmail.com",
            weeks_delivered: "2",
            first_order_date: "4/20/2021",
        },
        {
            email: "fazkris@yahoo.de",
            weeks_delivered: "2",
            first_order_date: "4/20/2021",
        },
        {
            email: "marina3_gs@hotmail.com",
            weeks_delivered: "2",
            first_order_date: "4/19/2021",
        },
        {
            email: "lisaglimvik@hotmail.com",
            weeks_delivered: "20",
            first_order_date: "4/20/2021",
        },
        {
            email: "simone_kajita@yahoo.com.br",
            weeks_delivered: "26",
            first_order_date: "4/21/2021",
        },
        {
            email: "aralarre@gmail.com",
            weeks_delivered: "30",
            first_order_date: "4/21/2021",
        },
        {
            email: "schenonesoledad@gmail.com",
            weeks_delivered: "8",
            first_order_date: "4/22/2021",
        },
        {
            email: "mialucci@me.com",
            weeks_delivered: "10",
            first_order_date: "4/22/2021",
        },
        {
            email: "nataliaantonova1990@gmail.com",
            weeks_delivered: "1",
            first_order_date: "4/23/2021",
        },
        {
            email: "antonellasoledadsardi@gmail.com",
            weeks_delivered: "1",
            first_order_date: "4/23/2021",
        },
        {
            email: "brittaheisterkamp@gmail.com",
            weeks_delivered: "8",
            first_order_date: "4/24/2021",
        },
        {
            email: "jeremy.cuif@gmail.com",
            weeks_delivered: "18",
            first_order_date: "4/25/2021",
        },
        {
            email: "alexander.dyachenko@gmail.com",
            weeks_delivered: "13",
            first_order_date: "4/25/2021",
        },
        {
            email: "s.j.vestit@gmail.com",
            weeks_delivered: "22",
            first_order_date: "11/17/2019",
        },
        {
            email: "dianaaustin02@gmail.com",
            weeks_delivered: "2",
            first_order_date: "4/27/2021",
        },
        {
            email: "alejandrogm3600@gmail.com",
            weeks_delivered: "2",
            first_order_date: "4/28/2021",
        },
        {
            email: "judit.ferrerf@gmail.com",
            weeks_delivered: "1",
            first_order_date: "4/28/2021",
        },
        {
            email: "miekebunk@mac.com",
            weeks_delivered: "29",
            first_order_date: "4/30/2021",
        },
        {
            email: "mariebnordby@gmail.com",
            weeks_delivered: "5",
            first_order_date: "4/30/2021",
        },
        {
            email: "sv.esmoris@gmail.com",
            weeks_delivered: "8",
            first_order_date: "5/2/2021",
        },
        {
            email: "baptiste.richard2020@gmail.com",
            weeks_delivered: "1",
            first_order_date: "5/3/2021",
        },
        {
            email: "tombaq_88@hotmail.com",
            weeks_delivered: "1",
            first_order_date: "5/5/2021",
        },
        {
            email: "gianluca.gandini@gmail.com",
            weeks_delivered: "3",
            first_order_date: "5/6/2021",
        },
        {
            email: "nic.velho@gmail.com",
            weeks_delivered: "20",
            first_order_date: "5/6/2021",
        },
        {
            email: "nborovac@gmail.com",
            weeks_delivered: "22",
            first_order_date: "5/6/2021",
        },
        {
            email: "daniilpopl1111@gmail.com",
            weeks_delivered: "1",
            first_order_date: "5/7/2021",
        },
        {
            email: "cosmin.es@gmail.com",
            weeks_delivered: "2",
            first_order_date: "5/7/2021",
        },
        {
            email: "guericm@hotmail.fr",
            weeks_delivered: "5",
            first_order_date: "5/7/2021",
        },
        {
            email: "agata.winowska@gmail.com",
            weeks_delivered: "29",
            first_order_date: "5/7/2021",
        },
        {
            email: "nina.brumma@googlemail.com",
            weeks_delivered: "27",
            first_order_date: "5/9/2021",
        },
        {
            email: "mariah.girouard@gmail.com",
            weeks_delivered: "25",
            first_order_date: "5/10/2021",
        },
        {
            email: "mada.damien@gmail.com",
            weeks_delivered: "24",
            first_order_date: "5/10/2021",
        },
        {
            email: "mr.gill@gmail.com",
            weeks_delivered: "29",
            first_order_date: "5/10/2021",
        },
        {
            email: "marcmarin88@gmail.com",
            weeks_delivered: "17",
            first_order_date: "5/11/2021",
        },
        {
            email: "lara.teruel@gmail.com",
            weeks_delivered: "2",
            first_order_date: "5/12/2021",
        },
        {
            email: "jordi@disfrutaverdura.com",
            weeks_delivered: "2",
            first_order_date: "5/14/2021",
        },
        {
            email: "jul.pasechnik@gmail.com",
            weeks_delivered: "1",
            first_order_date: "5/15/2021",
        },
        {
            email: "vgoslow@gmail.com",
            weeks_delivered: "4",
            first_order_date: "5/16/2021",
        },
        {
            email: "jaxmac5@aol.com",
            weeks_delivered: "23",
            first_order_date: "5/17/2021",
        },
        {
            email: "stephanievdhoeven@gmail.com",
            weeks_delivered: "21",
            first_order_date: "5/17/2021",
        },
        {
            email: "oanamaria.dinca@gmail.com",
            weeks_delivered: "6",
            first_order_date: "5/19/2021",
        },
        {
            email: "clau2acjx@hotmail.com",
            weeks_delivered: "1",
            first_order_date: "5/17/2021",
        },
        {
            email: "esteban.pratolongo@gmail.com",
            weeks_delivered: "1",
            first_order_date: "5/16/2021",
        },
        {
            email: "svmendelsohn@gmail.com",
            weeks_delivered: "29",
            first_order_date: "5/21/2021",
        },
        {
            email: "bo13linnsvensson@gmail.com",
            weeks_delivered: "24",
            first_order_date: "5/24/2021",
        },
        {
            email: "malin.ec.svensson@gmail.com",
            weeks_delivered: "6",
            first_order_date: "5/25/2021",
        },
        {
            email: "gabrieltejerina@gmail.com",
            weeks_delivered: "1",
            first_order_date: "5/25/2021",
        },
        {
            email: "mariaplazaangulo@hotmail.com",
            weeks_delivered: "3",
            first_order_date: "5/26/2021",
        },
        {
            email: "pau1es@hotmail.com",
            weeks_delivered: "7",
            first_order_date: "5/31/2021",
        },
        {
            email: "agmezadelama@gmail.com",
            weeks_delivered: "15",
            first_order_date: "10/29/2019",
        },
        {
            email: "aalewis1@me.com",
            weeks_delivered: "20",
            first_order_date: "5/31/2021",
        },
        {
            email: "marc.altayo@gmail.com",
            weeks_delivered: "9",
            first_order_date: "5/28/2021",
        },
        {
            email: "taniagrisan@gmail.com",
            weeks_delivered: "1",
            first_order_date: "5/31/2021",
        },
        {
            email: "xavierbordasp@gmail.com",
            weeks_delivered: "1",
            first_order_date: "6/2/2021",
        },
        {
            email: "quark82@gmail.com",
            weeks_delivered: "29",
            first_order_date: "6/2/2021",
        },
        {
            email: "alisonleonard08@gmail.com",
            weeks_delivered: "3",
            first_order_date: "6/2/2021",
        },
        {
            email: "badetomruk@hotmail.com",
            weeks_delivered: "16",
            first_order_date: "6/3/2021",
        },
        {
            email: "elenakhar@gmail.com",
            weeks_delivered: "10",
            first_order_date: "6/4/2021",
        },
        {
            email: "marta_ventura@live.com.pt",
            weeks_delivered: "11",
            first_order_date: "6/4/2021",
        },
        {
            email: "fendy.cg28@gmail.com",
            weeks_delivered: "30",
            first_order_date: "6/6/2021",
        },
        {
            email: "mpalesarredonda@gmail.com",
            weeks_delivered: "1",
            first_order_date: "6/9/2021",
        },
        {
            email: "daisyvanderheijden@gmail.com",
            weeks_delivered: "1",
            first_order_date: "6/9/2021",
        },
        {
            email: "naabeel412@gmail.com",
            weeks_delivered: "4",
            first_order_date: "6/11/2021",
        },
        {
            email: "louisevind@gmail.com",
            weeks_delivered: "1",
            first_order_date: "6/13/2021",
        },
        {
            email: "Maxi.schumm@gmail.com",
            weeks_delivered: "29",
            first_order_date: "6/13/2021",
        },
        {
            email: "lyuba.golovina@gmail.com",
            weeks_delivered: "26",
            first_order_date: "6/13/2021",
        },
        {
            email: "flor.vilardebo@gmail.com",
            weeks_delivered: "1",
            first_order_date: "6/15/2021",
        },
        {
            email: "jose.godoi@huddling.com.br",
            weeks_delivered: "20",
            first_order_date: "6/16/2021",
        },
        {
            email: "ntaibah@gmail.com",
            weeks_delivered: "10",
            first_order_date: "6/17/2021",
        },
        {
            email: "sales@restauraniza.com",
            weeks_delivered: "1",
            first_order_date: "6/22/2021",
        },
        {
            email: "msanoja87@gmail.com",
            weeks_delivered: "17",
            first_order_date: "6/23/2021",
        },
        {
            email: "yashar.khazdouzian@gmail.com",
            weeks_delivered: "10",
            first_order_date: "6/23/2021",
        },
        {
            email: "xavier@antoviaque.org",
            weeks_delivered: "4",
            first_order_date: "6/24/2021",
        },
        {
            email: "ramona.ziegler27@gmail.com",
            weeks_delivered: "15",
            first_order_date: "6/24/2021",
        },
        {
            email: "ali.aljishi@live.com",
            weeks_delivered: "2",
            first_order_date: "6/25/2021",
        },
        {
            email: "betofrance@gmail.com",
            weeks_delivered: "1",
            first_order_date: "6/25/2021",
        },
        {
            email: "anastasiadema@gmail.com",
            weeks_delivered: "9",
            first_order_date: "6/27/2021",
        },
        {
            email: "anametz@gmail.com",
            weeks_delivered: "2",
            first_order_date: "6/27/2021",
        },
        {
            email: "chandro.notten@outlook.com",
            weeks_delivered: "3",
            first_order_date: "6/30/2021",
        },
        {
            email: "cesare.cugnasco@gmail.com",
            weeks_delivered: "15",
            first_order_date: "6/30/2021",
        },
        {
            email: "laurakmason@gmail.com",
            weeks_delivered: "3",
            first_order_date: "7/1/2021",
        },
        {
            email: "manelvelmai2010@gmail.com",
            weeks_delivered: "1",
            first_order_date: "7/2/2021",
        },
        {
            email: "novajose@gmail.com",
            weeks_delivered: "3",
            first_order_date: "7/7/2021",
        },
        {
            email: "tim.mutimer@mac.com",
            weeks_delivered: "3",
            first_order_date: "7/8/2021",
        },
        {
            email: "mf792@hotmail.com",
            weeks_delivered: "9",
            first_order_date: "7/8/2021",
        },
        {
            email: "triciamparris@gmail.com",
            weeks_delivered: "14",
            first_order_date: "7/9/2021",
        },
        {
            email: "isabellabiancotti@gmail.com",
            weeks_delivered: "20",
            first_order_date: "7/15/2021",
        },
        {
            email: "cornelieschungel@gmail.com",
            weeks_delivered: "16",
            first_order_date: "7/16/2021",
        },
        {
            email: "c_jenek@mail.ru",
            weeks_delivered: "19",
            first_order_date: "7/17/2021",
        },
        {
            email: "leboulicaut.oliver@gmail.com",
            weeks_delivered: "2",
            first_order_date: "7/19/2021",
        },
        {
            email: "domnech@gmail.com",
            weeks_delivered: "8",
            first_order_date: "7/20/2021",
        },
        {
            email: "randal.a.moore@gmail.com",
            weeks_delivered: "20",
            first_order_date: "7/22/2021",
        },
        {
            email: "gabrisa-fm@hotmail.com",
            weeks_delivered: "1",
            first_order_date: "7/25/2021",
        },
        {
            email: "nicoleta.n.badea@gmail.com",
            weeks_delivered: "4",
            first_order_date: "7/26/2021",
        },
        {
            email: "david.alejandro.negrete@gmail.com",
            weeks_delivered: "7",
            first_order_date: "7/26/2021",
        },
        {
            email: "elisabetbf@hotmail.com",
            weeks_delivered: "12",
            first_order_date: "7/27/2021",
        },
        {
            email: "miasilveira@gmail.com",
            weeks_delivered: "11",
            first_order_date: "7/29/2021",
        },
        {
            email: "victoriaross83@gmail.com",
            weeks_delivered: "7",
            first_order_date: "8/2/2021",
        },
        {
            email: "tutty_1987@icloud.com",
            weeks_delivered: "3",
            first_order_date: "8/3/2021",
        },
        {
            email: "mkelly6434@gmail.com",
            weeks_delivered: "1",
            first_order_date: "8/3/2021",
        },
        {
            email: "seriol.silvia@gmail.com",
            weeks_delivered: "1",
            first_order_date: "8/4/2021",
        },
        {
            email: "nualadoyle12@gmail.com",
            weeks_delivered: "13",
            first_order_date: "8/5/2021",
        },
        {
            email: "josebragv@gmail.com",
            weeks_delivered: "1",
            first_order_date: "8/6/2021",
        },
        {
            email: "aoyamaayako@gmail.com",
            weeks_delivered: "14",
            first_order_date: "8/8/2021",
        },
        {
            email: "galing@gmx.net",
            weeks_delivered: "5",
            first_order_date: "8/8/2021",
        },
        {
            email: "lauramonforte@gmail.com",
            weeks_delivered: "17",
            first_order_date: "8/9/2021",
        },
        {
            email: "mironanicola@gmail.com",
            weeks_delivered: "1",
            first_order_date: "8/9/2021",
        },
        {
            email: "dimelzaosorio@gmail.com",
            weeks_delivered: "17",
            first_order_date: "8/10/2021",
        },
        {
            email: "mattjaemie@gmail.com",
            weeks_delivered: "7",
            first_order_date: "8/15/2021",
        },
        {
            email: "simon.wolf1994@gmail.com",
            weeks_delivered: "1",
            first_order_date: "8/16/2021",
        },
        {
            email: "dvasupremo@gmail.com",
            weeks_delivered: "11",
            first_order_date: "8/18/2021",
        },
        {
            email: "jcespinosa@gmail.com",
            weeks_delivered: "3",
            first_order_date: "8/20/2021",
        },
        {
            email: "nspainw@gmail.com",
            weeks_delivered: "8",
            first_order_date: "8/21/2021",
        },
        {
            email: "davidgd24@gmail.com",
            weeks_delivered: "6",
            first_order_date: "8/23/2021",
        },
        {
            email: "derekpreheim@gmail.com",
            weeks_delivered: "3",
            first_order_date: "8/23/2021",
        },
        {
            email: "leonardhalling@gmail.com",
            weeks_delivered: "4",
            first_order_date: "8/27/2021",
        },
        {
            email: "marta.cusso@gmail.com",
            weeks_delivered: "17",
            first_order_date: "8/27/2021",
        },
        {
            email: "email@maciej.one",
            weeks_delivered: "8",
            first_order_date: "8/28/2021",
        },
        {
            email: "dirkzwager.aimee@hotmail.com",
            weeks_delivered: "13",
            first_order_date: "8/28/2021",
        },
        {
            email: "epeterfreer@gmail.com",
            weeks_delivered: "15",
            first_order_date: "8/30/2021",
        },
        {
            email: "NikolayNenov@gmail.com",
            weeks_delivered: "16",
            first_order_date: "8/31/2021",
        },
        {
            email: "kjsalvany@gmail.com",
            weeks_delivered: "13",
            first_order_date: "8/31/2021",
        },
        {
            email: "facturacio@campjoliu.net",
            weeks_delivered: "10",
            first_order_date: "9/2/2021",
        },
        {
            email: "eddie.cantoni96@gmail.com",
            weeks_delivered: "14",
            first_order_date: "9/2/2021",
        },
        {
            email: "maxkapitonov@gmail.com",
            weeks_delivered: "3",
            first_order_date: "9/2/2021",
        },
        {
            email: "sasso.sabrina@outlook.com",
            weeks_delivered: "1",
            first_order_date: "9/2/2021",
        },
        {
            email: "celia.bernazzani@hotmail.fr",
            weeks_delivered: "2",
            first_order_date: "9/3/2021",
        },
        {
            email: "phooky@hotmail.com",
            weeks_delivered: "1",
            first_order_date: "9/3/2021",
        },
        {
            email: "lynnette.wt.ang@gmail.com",
            weeks_delivered: "3",
            first_order_date: "9/4/2021",
        },
        {
            email: "thomas_leenen@hotmail.com",
            weeks_delivered: "17",
            first_order_date: "9/4/2021",
        },
        {
            email: "jeroenveenn@gmail.com",
            weeks_delivered: "3",
            first_order_date: "9/4/2021",
        },
        {
            email: "andy.weight@gmail.com",
            weeks_delivered: "2",
            first_order_date: "9/5/2021",
        },
        {
            email: "abdulazizaradi@hotmail.com",
            weeks_delivered: "1",
            first_order_date: "9/5/2021",
        },
        {
            email: "danilova.maria.k@gmail.com",
            weeks_delivered: "1",
            first_order_date: "9/7/2021",
        },
        {
            email: "marc@keynest.com",
            weeks_delivered: "2",
            first_order_date: "9/7/2021",
        },
        {
            email: "3lena.mar3@gmail.com",
            weeks_delivered: "10",
            first_order_date: "9/7/2021",
        },
        {
            email: "raphadavid@gmail.com",
            weeks_delivered: "16",
            first_order_date: "9/7/2021",
        },
        {
            email: "crodriguezribas@gmail.com",
            weeks_delivered: "13",
            first_order_date: "9/8/2021",
        },
        {
            email: "nicolaucavaller@gmail.com",
            weeks_delivered: "1",
            first_order_date: "9/8/2021",
        },
        {
            email: "sdellafaille@gmail.com",
            weeks_delivered: "1",
            first_order_date: "9/8/2021",
        },
        {
            email: "lisaspaans@live.nl",
            weeks_delivered: "6",
            first_order_date: "9/10/2021",
        },
        {
            email: "jecwells@yahoo.co.uk",
            weeks_delivered: "1",
            first_order_date: "9/11/2021",
        },
        {
            email: "dasha_perekrestenko@hotmail.com",
            weeks_delivered: "4",
            first_order_date: "9/13/2021",
        },
        {
            email: "luismiguelru1992@gmail.com",
            weeks_delivered: "11",
            first_order_date: "9/12/2021",
        },
        {
            email: "irene.vilar.arcarons@gmail.com",
            weeks_delivered: "1",
            first_order_date: "9/16/2021",
        },
        {
            email: "kadjianais@gmail.com",
            weeks_delivered: "4",
            first_order_date: "9/17/2021",
        },
        {
            email: "sfurede@aol.com",
            weeks_delivered: "10",
            first_order_date: "9/17/2021",
        },
        {
            email: "mgreen17@gmail.com",
            weeks_delivered: "1",
            first_order_date: "9/18/2021",
        },
        {
            email: "benedicte_walter@yahoo.fr",
            weeks_delivered: "3",
            first_order_date: "9/19/2021",
        },
        {
            email: "alvaro_g90@hotmail.com",
            weeks_delivered: "3",
            first_order_date: "9/19/2021",
        },
        {
            email: "anais.lamarti@gmail.com",
            weeks_delivered: "1",
            first_order_date: "9/19/2021",
        },
        {
            email: "goasdoue.picot@gmail.com",
            weeks_delivered: "11",
            first_order_date: "9/20/2021",
        },
        {
            email: "sofia.bezzato@gmail.com",
            weeks_delivered: "1",
            first_order_date: "9/20/2021",
        },
        {
            email: "kirkjane18@gmail.com",
            weeks_delivered: "10",
            first_order_date: "9/16/2021",
        },
        {
            email: "shalini.bh@gmail.com",
            weeks_delivered: "13",
            first_order_date: "9/21/2021",
        },
        {
            email: "lucilledubos@gmail.com",
            weeks_delivered: "5",
            first_order_date: "9/22/2021",
        },
        {
            email: "martitr2010@gmail.com",
            weeks_delivered: "2",
            first_order_date: "9/22/2021",
        },
        {
            email: "laraghlarsen@gmail.com",
            weeks_delivered: "10",
            first_order_date: "9/23/2021",
        },
        {
            email: "hanne_dv@hotmail.com",
            weeks_delivered: "2",
            first_order_date: "9/24/2021",
        },
        {
            email: "dorienvanriel@gmail.com",
            weeks_delivered: "7",
            first_order_date: "9/24/2021",
        },
        {
            email: "erik.wengefelt@gmail.com",
            weeks_delivered: "11",
            first_order_date: "9/24/2021",
        },
        {
            email: "Florenciastella@outlook.com",
            weeks_delivered: "5",
            first_order_date: "9/24/2021",
        },
        {
            email: "anwb8279@gmail.com",
            weeks_delivered: "11",
            first_order_date: "9/25/2021",
        },
        {
            email: "whatsoever@mail.ru",
            weeks_delivered: "2",
            first_order_date: "9/26/2021",
        },
        {
            email: "koolaiho@gmail.com",
            weeks_delivered: "10",
            first_order_date: "9/27/2021",
        },
        {
            email: "tanea_doaga@yahoo.com",
            weeks_delivered: "6",
            first_order_date: "9/27/2021",
        },
        {
            email: "heddastellefsen@gmail.com",
            weeks_delivered: "3",
            first_order_date: "9/28/2021",
        },
        {
            email: "attiya.abdulghany@gmail.com",
            weeks_delivered: "8",
            first_order_date: "9/28/2021",
        },
        {
            email: "maartenvandenbroek@gmail.com",
            weeks_delivered: "12",
            first_order_date: "9/29/2021",
        },
        {
            email: "campospiera.elena@gmail.com",
            weeks_delivered: "2",
            first_order_date: "10/2/2021",
        },
        {
            email: "andreuginer95@gmail.com",
            weeks_delivered: "8",
            first_order_date: "10/4/2021",
        },
        {
            email: "anajmm@hotmail.com",
            weeks_delivered: "8",
            first_order_date: "10/4/2021",
        },
        {
            email: "c.fontaine1@newcastle.ac.uk",
            weeks_delivered: "10",
            first_order_date: "10/3/2021",
        },
        {
            email: "chirolacabanillas@gmail.com",
            weeks_delivered: "4",
            first_order_date: "10/4/2021",
        },
        {
            email: "patrick.truempi@me.com",
            weeks_delivered: "7",
            first_order_date: "10/6/2021",
        },
        {
            email: "shawn.p.anderson63@gmail.com",
            weeks_delivered: "2",
            first_order_date: "10/11/2021",
        },
        {
            email: "vplaja@gmail.com",
            weeks_delivered: "4",
            first_order_date: "10/11/2021",
        },
        {
            email: "shinobiswar@gmail.com",
            weeks_delivered: "1",
            first_order_date: "10/11/2021",
        },
        {
            email: "azzi.ge@gmail.com",
            weeks_delivered: "10",
            first_order_date: "10/11/2021",
        },
        {
            email: "arthur.geheniau@gmail.com",
            weeks_delivered: "1",
            first_order_date: "10/12/2021",
        },
        {
            email: "casadevallaguilo@gmail.com",
            weeks_delivered: "2",
            first_order_date: "10/13/2021",
        },
        {
            email: "haedenfura@gmail.com",
            weeks_delivered: "10",
            first_order_date: "10/13/2021",
        },
        {
            email: "chenekoscielny@gmail.com",
            weeks_delivered: "9",
            first_order_date: "10/14/2021",
        },
        {
            email: "imogennash@gmail.com",
            weeks_delivered: "8",
            first_order_date: "10/18/2021",
        },
        {
            email: "bjornalmgren34@gmail.com",
            weeks_delivered: "8",
            first_order_date: "10/18/2021",
        },
        {
            email: "pingodachina@hotmail.com",
            weeks_delivered: "2",
            first_order_date: "10/19/2021",
        },
        {
            email: "murielveenstra96@gmail.com",
            weeks_delivered: "1",
            first_order_date: "10/19/2021",
        },
        {
            email: "crodriguezsirgado@gmail.com",
            weeks_delivered: "8",
            first_order_date: "10/20/2021",
        },
        {
            email: "hanmcdermo@gmail.com",
            weeks_delivered: "7",
            first_order_date: "10/20/2021",
        },
        {
            email: "lavirginia@gmail.com",
            weeks_delivered: "10",
            first_order_date: "10/21/2021",
        },
        {
            email: "zapamon@hotmail.com",
            weeks_delivered: "1",
            first_order_date: "10/22/2021",
        },
        {
            email: "pal.gar89@gmail.com",
            weeks_delivered: "7",
            first_order_date: "10/22/2021",
        },
        {
            email: "anonnymiss@hotmail.com",
            weeks_delivered: "9",
            first_order_date: "10/23/2021",
        },
        {
            email: "paddy.synge@hotmail.co.uk",
            weeks_delivered: "6",
            first_order_date: "10/23/2021",
        },
        {
            email: "weshenshall@gmail.com",
            weeks_delivered: "1",
            first_order_date: "10/24/2021",
        },
        {
            email: "charlotte.biron111@gmail.com",
            weeks_delivered: "2",
            first_order_date: "10/25/2021",
        },
        {
            email: "pjt1991@gmail.com",
            weeks_delivered: "9",
            first_order_date: "10/25/2021",
        },
        {
            email: "claire.italien@gmail.com",
            weeks_delivered: "7",
            first_order_date: "10/25/2021",
        },
        {
            email: "maparraj@gmail.com",
            weeks_delivered: "7",
            first_order_date: "10/26/2021",
        },
        {
            email: "albatros.ivair@gmail.com",
            weeks_delivered: "3",
            first_order_date: "10/26/2021",
        },
        {
            email: "christinaulfsparre299@hotmail.com",
            weeks_delivered: "1",
            first_order_date: "10/26/2021",
        },
        {
            email: "RDHEERAJ10@GMAIL.COM",
            weeks_delivered: "1",
            first_order_date: "10/26/2021",
        },
        {
            email: "anoeks@gmail.com",
            weeks_delivered: "7",
            first_order_date: "10/26/2021",
        },
        {
            email: "jimenezlopezarturo@gmail.com",
            weeks_delivered: "6",
            first_order_date: "10/27/2021",
        },
        {
            email: "myriankatto@gmail.com",
            weeks_delivered: "8",
            first_order_date: "10/28/2021",
        },
        {
            email: "cullennufc91@hotmail.com",
            weeks_delivered: "8",
            first_order_date: "10/28/2021",
        },
        {
            email: "jackeline.gonzalesr@gmail.com",
            weeks_delivered: "3",
            first_order_date: "10/28/2021",
        },
        {
            email: "ines.valverde16@gmail.com",
            weeks_delivered: "4",
            first_order_date: "10/31/2021",
        },
        {
            email: "Gueri14@Hotmail.com",
            weeks_delivered: "2",
            first_order_date: "10/31/2021",
        },
        {
            email: "juliaturuu19@gmail.com",
            weeks_delivered: "1",
            first_order_date: "11/1/2021",
        },
        {
            email: "Lorenz.verv@hotmail.com",
            weeks_delivered: "4",
            first_order_date: "11/1/2021",
        },
        {
            email: "sandernina@hotmail.de",
            weeks_delivered: "1",
            first_order_date: "11/2/2021",
        },
        {
            email: "bbhaase@gmail.com",
            weeks_delivered: "1",
            first_order_date: "11/2/2021",
        },
        {
            email: "alfaro.an@gmail.com",
            weeks_delivered: "1",
            first_order_date: "11/3/2021",
        },
        {
            email: "luisafernanda.toro@outlook.es",
            weeks_delivered: "2",
            first_order_date: "11/3/2021",
        },
        {
            email: "gero_markowski@web.de",
            weeks_delivered: "2",
            first_order_date: "11/3/2021",
        },
        {
            email: "dmagdalena364@gmail.com",
            weeks_delivered: "2",
            first_order_date: "11/4/2021",
        },
        {
            email: "sarina.liptiay@gmail.com",
            weeks_delivered: "2",
            first_order_date: "11/4/2021",
        },
        {
            email: "zac.sands@hotmail.co.uk",
            weeks_delivered: "8",
            first_order_date: "11/4/2021",
        },
        {
            email: "navarijo@hotmail.com",
            weeks_delivered: "5",
            first_order_date: "11/5/2021",
        },
        {
            email: "victor.el.aguila@gmail.com",
            weeks_delivered: "6",
            first_order_date: "11/6/2021",
        },
        {
            email: "holly.bryce13@gmail.com",
            weeks_delivered: "3",
            first_order_date: "11/6/2021",
        },
        {
            email: "hunabmc@gmail.com",
            weeks_delivered: "2",
            first_order_date: "11/6/2021",
        },
        {
            email: "wfraberger@gmail.com",
            weeks_delivered: "4",
            first_order_date: "11/6/2021",
        },
        {
            email: "nataliatatc@gmail.com",
            weeks_delivered: "1",
            first_order_date: "11/6/2021",
        },
        {
            email: "mcgillk@gmail.com",
            weeks_delivered: "3",
            first_order_date: "11/6/2021",
        },
        {
            email: "marta_jose_prado@hotmail.com",
            weeks_delivered: "6",
            first_order_date: "11/6/2021",
        },
        {
            email: "holaaudreylellouche@gmail.com",
            weeks_delivered: "5",
            first_order_date: "11/7/2021",
        },
        {
            email: "philippa.j.ross@gmail.com",
            weeks_delivered: "8",
            first_order_date: "11/7/2021",
        },
        {
            email: "pamesilva504@gmail.com",
            weeks_delivered: "1",
            first_order_date: "11/7/2021",
        },
        {
            email: "sandraborras13@hotmail.com",
            weeks_delivered: "1",
            first_order_date: "11/7/2021",
        },
        {
            email: "rmhortensius@gmail.com",
            weeks_delivered: "1",
            first_order_date: "11/7/2021",
        },
        {
            email: "aziendemadeinsardegna@gmail.com",
            weeks_delivered: "1",
            first_order_date: "11/7/2021",
        },
        {
            email: "ayelenchess@gmail.com",
            weeks_delivered: "1",
            first_order_date: "11/7/2021",
        },
        {
            email: "mosen_1994@hotmail.com",
            weeks_delivered: "2",
            first_order_date: "11/8/2021",
        },
        {
            email: "crisfur@gmail.com",
            weeks_delivered: "5",
            first_order_date: "11/8/2021",
        },
        {
            email: "lovelaietax@gmail.com",
            weeks_delivered: "2",
            first_order_date: "11/11/2021",
        },
        {
            email: "beus23@gmail.com",
            weeks_delivered: "4",
            first_order_date: "11/12/2021",
        },
        {
            email: "adribaubar@gmail.com",
            weeks_delivered: "1",
            first_order_date: "11/12/2021",
        },
        {
            email: "teresacanal@yahoo.es",
            weeks_delivered: "3",
            first_order_date: "11/12/2021",
        },
        {
            email: "pevendramini@gmail.com",
            weeks_delivered: "5",
            first_order_date: "11/12/2021",
        },
        {
            email: "alexhough96@gmail.com",
            weeks_delivered: "2",
            first_order_date: "11/13/2021",
        },
        {
            email: "silvia.milamas@gmail.com",
            weeks_delivered: "4",
            first_order_date: "11/13/2021",
        },
        {
            email: "caroline.astrom@fastighetsbyran.se",
            weeks_delivered: "2",
            first_order_date: "11/14/2021",
        },
        {
            email: "mpp24912@gmail.com",
            weeks_delivered: "7",
            first_order_date: "11/15/2021",
        },
        {
            email: "cjskim@gmail.com",
            weeks_delivered: "6",
            first_order_date: "11/16/2021",
        },
        {
            email: "c.roca@hotmail.com",
            weeks_delivered: "1",
            first_order_date: "11/17/2021",
        },
        {
            email: "viscun@gmail.com",
            weeks_delivered: "2",
            first_order_date: "11/17/2021",
        },
        {
            email: "mherranzfo@gmail.com",
            weeks_delivered: "5",
            first_order_date: "11/17/2021",
        },
        {
            email: "stewardess@mini-y.com",
            weeks_delivered: "6",
            first_order_date: "11/17/2021",
        },
        {
            email: "howie.linda@aol.com",
            weeks_delivered: "2",
            first_order_date: "11/18/2021",
        },
        {
            email: "diane.sicsic@icloud.com",
            weeks_delivered: "1",
            first_order_date: "11/18/2021",
        },
        {
            email: "vackabcn@gmail.com",
            weeks_delivered: "1",
            first_order_date: "11/18/2021",
        },
        {
            email: "pv.paolovitale@gmail.com",
            weeks_delivered: "3",
            first_order_date: "11/18/2021",
        },
        {
            email: "eeb_04@hotmail.com",
            weeks_delivered: "3",
            first_order_date: "11/18/2021",
        },
        {
            email: "anacosialls@hotmail.com",
            weeks_delivered: "6",
            first_order_date: "11/19/2021",
        },
        {
            email: "saroca01@gmail.com",
            weeks_delivered: "1",
            first_order_date: "11/19/2021",
        },
        {
            email: "luciachauveau@gmail.com",
            weeks_delivered: "1",
            first_order_date: "11/20/2021",
        },
        {
            email: "lrobinson@whiskyinvestmentpartners.com",
            weeks_delivered: "3",
            first_order_date: "11/21/2021",
        },
        {
            email: "bpankis@gmail.com",
            weeks_delivered: "1",
            first_order_date: "11/22/2021",
        },
        {
            email: "tomstockell@hotmail.co.uk",
            weeks_delivered: "4",
            first_order_date: "11/23/2021",
        },
        {
            email: "celinaresb@gmail.com",
            weeks_delivered: "2",
            first_order_date: "11/23/2021",
        },
        {
            email: "andrew.lee.cooper@pm.me",
            weeks_delivered: "4",
            first_order_date: "11/24/2021",
        },
        {
            email: "yolandacayuela@hotmail.com",
            weeks_delivered: "4",
            first_order_date: "11/24/2021",
        },
        {
            email: "sarah.smelik@gmail.com",
            weeks_delivered: "5",
            first_order_date: "11/26/2021",
        },
        {
            email: "pinarello3@hotmail.com",
            weeks_delivered: "5",
            first_order_date: "11/26/2021",
        },
        {
            email: "newanastas@gmail.com",
            weeks_delivered: "2",
            first_order_date: "11/26/2021",
        },
        {
            email: "sorin.audrey35@gmail.com",
            weeks_delivered: "4",
            first_order_date: "11/28/2021",
        },
        {
            email: "kalse_naomi@hotmail.com",
            weeks_delivered: "4",
            first_order_date: "11/30/2021",
        },
        {
            email: "peptenaru.beatrice@gmail.com",
            weeks_delivered: "2",
            first_order_date: "12/1/2021",
        },
        {
            email: "head.bcn@stgeorge.es",
            weeks_delivered: "2",
            first_order_date: "12/3/2021",
        },
        {
            email: "theresa.tobollik@gmail.com",
            weeks_delivered: "2",
            first_order_date: "12/3/2021",
        },
        {
            email: "noe29gp@gmail.com",
            weeks_delivered: "3",
            first_order_date: "12/5/2021",
        },
        {
            email: "brichackova.adela@gmail.com",
            weeks_delivered: "1",
            first_order_date: "12/8/2021",
        },
        {
            email: "nicorici.alexa@gmail.com",
            weeks_delivered: "1",
            first_order_date: "12/8/2021",
        },
        {
            email: "therese.vanderheijden@avis.nl",
            weeks_delivered: "2",
            first_order_date: "12/10/2021",
        },
        {
            email: "gvelsan@gmail.com",
            weeks_delivered: "3",
            first_order_date: "12/10/2021",
        },
        {
            email: "domarackajustyna@gmail.com",
            weeks_delivered: "1",
            first_order_date: "12/11/2021",
        },
        {
            email: "lesya.polyakova@gmail.com",
            weeks_delivered: "1",
            first_order_date: "12/13/2021",
        },
        {
            email: "jennie.cowie@yahoo.co.uk",
            weeks_delivered: "3",
            first_order_date: "12/14/2021",
        },
        {
            email: "henryollh205@gmail.com",
            weeks_delivered: "2",
            first_order_date: "12/19/2021",
        },
        {
            email: "wisdompoet@gmail.com",
            weeks_delivered: "1",
            first_order_date: "12/24/2021",
        },
        {
            email: "marctenblanco@gmail.com",
            weeks_delivered: "1",
            first_order_date: "12/25/2021",
        },
    ],
};
