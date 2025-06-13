function runCiteUnseen() {
    // Start timer that will be output to console at end of script:
    console.time('CiteUnseen runtime');

    // Store all references:
    let refs = document.querySelectorAll("cite, span.reference-text > a.external:first-of-type");

    // JSON objects with domain and string categorizaitons:
    let categorizedDomains = { "advocacy": ["1752group.com", "1in6.org", "21stcenturydems.org", "38degrees.org.uk", "500queerscientists.com", "50can.org", "60plus.org", "80-20initiative.net", "8thdaycenter.org", "a4nr.org", "aa.co.za", "aaa.com", "aaafund.org", "aaainc.org", "aacl.us", "aaees.org", "aaldef.org", "aapsonline.org", "aarp.org", "aba.com", "abahlali.org", "abd.org.uk", "abortionno.org", "abortionrightscampaign.ie", "acb.org", "acc.eco", "acceptromania.ro", "accessiblemeds.org", "accessnow.org", "accf-online.org", "accf.org", "accuracy.org", "ace-ej.org", "aceee.org", "acespace.org", "acf.org", "achr.net", "acl.org.au", "acli.com", "aclj.org", "aclu.org", "aclum.org", "acog.org", "acorninternational.org", "acpeds.org", "acri.org", "acri.org.il", "acslaw.org", "acsonline.org", "acterra.org", "actforamerica.org", "actonline.org", "actupny.com", "adaction.org", "adaptssi.org", "addthewords.org", "adf.org.qa", "adflegal.org", "adha.org", "adk.org", "adl.org", "advanceamerica.com", "advancingjustice-la.org", "ae911truth.org", "aegistrust.org", "aei.org", "aep.org.uk", "aer.ph", "aere.org", "aerotoxic.org", "afa.net", "afad-online.org", "afb.org", "afed.org.uk", "afer.org", "affirmation.org", "affordable-housing-party.org", "afia.org", "afj.org", "aflcio.org", "afriforum.co.za", "afterschoolalliance.org", "agifus.com", "aglp.org", "ahiworld.org", "aicfoundation.com", "aila.org", "aimovement.org", "aipac.org", "airportwatch.org.uk", "akdh.ch", "akia.aero", "ala.org", "alaforveterans.org", "alaskanstogether.org", "alb-net.com", "albavolunteer.org", "aleph.org.au", "alga.org.au", "alhurra.com", "ali.org", "alicebtoklas.org", "all.org", "allabouttrans.org.uk", "allout.org", "alnour.com.lb", "alp.org", "alpa.org", "alranz.org", "alternatifbilisim.org", "alternet.org", "amadeu-antonio-stiftung.de", "americafirstpolicies.org", "americanassembly.org", "americancrossroads.org", "americaneedsfatima.org", "americanforests.org", "americanfuturefund.com", "americanhiking.org", "americanimmigrationcouncil.org", "americaninstituteofbisexuality.org", "americanmustacheinstitute.org", "americannaziparty.com", "americanopportunity.org", "americanprairie.org", "americanprogress.org", "americanrightsatwork.org", "americanselect.org", "americansforprosperity.org", "americansforresponsiblesolutions.org", "americansfortruth.com", "americansolutions.com", "americantaskforce.org", "americanvision.org", "americaspower.org", "americavotes.org", "ameu.org", "amnesty.org", "amnesty.org.ph", "ampalestine.org", "amvets.org", "anca.org.au", "ancd.org.au", "ancientforestalliance.org", "ancpac.org", "anec.eu", "anghaeltacht.net", "anglicansforlife.org", "animals24-7.org", "anishinabek.ca", "annefrank.com", "anpi.it", "answercoalition.org", "anticapitalist.ru", "anticuts.com", "antifascistarchive.com", "antiracistaction.org", "aobm.org", "aontu.ie", "aopa.org", "apathyisboring.com", "apiequalitync.org", "apiqwtc.org", "appalachiantrail.org", "approvereferendum71.org", "apspuhuru.org", "arborday.org", "arcc-cdac.ca", "arcfc.org", "archcitydefenders.org", "arcigay.it", "arcuk.org.uk", "arcusfoundation.org", "ari.aynrand.org", "arizonaborderrecon.org", "armeniasputnik.am", "asatonline.org", "asbpa.org", "ascl.org.uk", "ase.org", "asiancdc.org", "aslef.org.uk", "aslrra.org", "aspiesforfreedom.com", "assatasdaughters.org", "assyrianpolicy.org", "astraeafoundation.org", "asyousow.org", "atheist-refugees.com", "atheist.ie", "atheists.org", "atime.es", "atl.org.uk", "atlantabike.org", "atr.org", "atticuscircle.org", "atwhatcost.org", "au.org", "aucd.org", "audubon.org", "aul.org", "ausbanking.org.au", "auschwitz.org", "australianmarriageequality.org", "autosafety.org", "autreat.com", "avaaz.org", "aver.us", "awiderbridge.org", "awnnetwork.org", "ayisozluk.com", "aytzim.org", "azadiradio.org", "azchamber.com", "babc.org", "backlash.org.uk", "ballot.org", "bamn.com", "banthebomb.org", "barackobama.com", "bastards.org", "bat-kol.org", "batcon.org", "bayareabisexualnetwork.org", "bazelon.org", "bbcm.org", "bbi.syr.edu", "bccla.org", "bda.org", "bdi.eu", "bds.org.np", "beacontn.org", "beanangel.ro", "becketfund.org", "bectu.org.uk", "beit-haverim.com", "belngo.info", "bertelsmann-stiftung.de", "bestforbritain.org", "bettertransport.org.uk", "bfawu.org", "bialogue.org", "bicyclecoalition.org", "bigbrotherwatch.org.uk", "bikeeastbay.org", "bikeleague.org", "binetusa.org", "bio.org", "biofuelwatch.org.uk", "biologicaldiversity.org", "bioneers.org", "bipartisanpolicy.org", "biresource.org", "birlikte.info", "blackandpink.org", "blacklivesmatter.com", "blackradicalcongress.org", "blacktie.org", "blindart.net", "blue-alliance.org", "bluearmy.com", "blueventures.org", "bma.org.uk", "bohnettfoundation.org", "boldnebraska.org", "boldprogressives.org", "boone-crockett.org", "bostonabcd.org", "boycottworkfare.org", "bpfna.org", "bpi.com", "bradleyfdn.org", "bradyunited.org", "brandeiscenter.com", "brandnewcongress.org", "breakingground.org", "brennancenter.org", "brightblue.org.uk", "bringbackbritishrail.org", "brookings.edu", "bsa.org", "bunniyom.com", "businesscouncil.com", "businessforscotland.co.uk", "businessroundtable.org", "bvrla.co.uk", "c-h-e.org.uk", "c4m.org.uk", "caabu.org", "caasf.org", "cageuk.org", "cagw.org", "cair.com", "cal.org.za", "calaware.org", "calcasa.org", "calgaryqueerartssociety.com", "californiansagainsthate.com", "calnurses.org", "caltax.org", "camera.org", "campaignlifecoalition.com", "campusantiwar.net", "campuspride.org", "can.org.nz", "canadian-republic.ca", "canadians4accountability.org", "canf.org", "capability-scotland.org.uk", "capsweb.org", "care.org.uk", "career.org", "carf.org.uk", "carp.ca", "casa-acae.com", "casa.org.au", "catalist.us", "cathmed.org", "catholic.com", "catholicsforchoice.org", "catholicunion.org.uk", "catholicvote.org", "cauce.org", "caus.org", "cba.ca", "cbeinternational.org", "cbpp.org", "cc-ds.org", "cc.org", "ccfd.ca", "ccla.org", "ccnd.gn.apc.org", "ccrjustice.org", "ccrl.ca", "ccrweb.ca", "cda.org", "cei.org", "celticleague.net", "centerforajustsociety.org", "centerforinquiry.org", "centerformedicalprogress.org", "centerforpolitics.org", "centerforsecuritypolicy.org", "cenvironment.blogspot.com", "cepf.net", "cepr.net", "ceres.org", "cerf.science", "cfib.ca", "cfoi.co.uk", "cfoi.org.uk", "cgtn.com", "chalcedon.edu", "cherishlife.org.au", "chesapeakebay.net", "chicagoabortionfund.com", "chicagoprogressivecaucus.com", "childrenshealthcare.org", "china.org.cn", "chinaaid.org", "chinadaily.com.cn", "chinadailyasia.com", "chinadailyhk.com", "chinalaborwatch.org", "chinanews.com", "chingusai.net", "choose-life.org", "chra-achru.ca", "christian.org.uk", "christianaction.org", "christianconcern.com", "christianvoice.org.uk", "churchofeuthanasia.org", "cih.org", "cija.ca", "cir-usa.org", "cis.org", "cis.org.au", "citizengo.org", "citizenscampaign.org", "citizensfor.com", "citizensunited.org", "civicworldwide.org", "civilrights.org", "civitas-institut.com", "ciwa.ca", "ciwr.org", "cjpac.ca", "cjpme.org", "cla-net.org", "clags.org", "clasp.org", "clb.org.hk", "cleanaircampaign.org", "cleanwateraction.org", "clear-uk.org", "clearpath.org", "climate-standards.org", "climatecounts.org", "climatehawksvote.com", "clubforgrowth.org", "clvu.org", "cmds.ceu.hu", "cmep.org", "cmrlink.org", "cmsny.org", "cncnews.cn", "cnib.ca", "cnpa.com", "cnre.eu", "cnt.es", "co2science.org", "coalitionformarriage.com.au", "coalitionforpublicsafety.org", "coalitionforthehomeless.org", "coastalstates.org", "coc.nl", "cohre.org", "cohsf.org", "coiste.ie", "colage.org", "coloradorighttolife.org", "coloredconventions.org", "comer.org", "commercialradio.com.au", "commoncause.org", "commonsensemedia.org", "communityair.org", "communitychange.org", "communitylivingontario.ca", "compassonline.org.uk", "comptia.org", "conbio.org", "concealedcampus.org", "concernedafricascholars.org", "concernedwomen.org", "concordcoalition.org", "conelmazodando.com.ve", "conginst.org", "congressionalleadershipfund.org", "conscienceonline.org.uk", "conservamerica.org", "conservation.org", "conservationfund.org", "conservativegroupforeurope.org.uk", "conservativemuslimforum.com", "conservativeusa.org", "constitutionparty.com", "constitutionproject.org", "consumerfed.org", "cookcountydems.com", "cooperationjackson.org", "core-online.org", "corecities.com", "corporateaccountability.org", "corporations.org", "councilforthenationalinterest.org", "counterextremism.com", "countryside-alliance.org.uk", "couragecampaign.org", "courageousconservativespac.com", "cows.org", "cpac.conservative.org", "cpaffc.org.cn", "cpdweb.org", "cpoa.org", "cpre.org.uk", "crae.org.uk", "craftivist-collective.com", "cragop.org", "crarr.org", "cre.org.uk", "criirad.org", "criticalresistance.org", "crla.org", "crmvet.org", "crnc.org", "crooked.com", "crooksandliars.com", "csbaonline.org", "csgkoeln.de", "csw.org.uk", "ctcommuterrailcouncil.org", "ctfamily.org", "ctj.org", "cufi.org", "cwcy.org", "cwf-fcf.org", "cyberdissidents.org", "cyclinguk.org", "cymdeithas.cymru", "dacorumheritage.org.uk", "dailysabah.com", "dairyfarmers.ca", "darksky.org", "dav.org", "dawncanada.net", "daxtonsfriends.com", "dayenu.org.au", "dayone.co.uk", "dbcflorida.org", "dcra.ca", "decarceratepa.info", "deepgreenresistance.org", "defenders.org", "defendingdemocracytogether.org", "defendingdissent.org", "degarfoundation.org", "delawareestuary.org", "delegatesunbound.com", "demandprogress.org", "demmajorityforisrael.org", "democracyalliance.org", "democracyforamerica.com", "democracymatters.ie", "democracymatters.org", "democracymovement.org.uk", "democracywithoutborders.org", "democraticmayors.org", "democrats.org", "democratsabroad.org", "democratsforlife.org", "demos.org", "dems.gov", "deplorablepride.org", "destinychurch.org.nz", "dfs.no", "diaa.asn.au", "diabetes.org", "dickshovel.com", "digital.org.au", "digitalcontentnext.org", "digitalrights.ie", "disabilitylabour.org.uk", "disabilityrightsuk.org", "disabledinaction.org", "disabledmotoring.org", "disabledpeoplesinternational.org", "dlcc.org", "dogbitelaw.com", "dogsbite.org", "dogwoodalliance.org", "downsizedc.org", "dpac.uk.net", "dredf.org", "drsforamerica.org", "dsausa.org", "dscc.org", "dsw.org", "ducks.org", "dunst.dk", "dvarp.org", "dvlf.org", "e-alliance.ch", "e3network.org", "eagleforum.org", "eapn.eu", "eappi.org", "earth-policy.org", "earthfirstjournal.news", "earthtrust.org", "ecohealthalliance.org", "ecologic.org", "ecomb.org", "economistsforfreetrade.com", "edenprojects.org", "edf.org", "edra.org", "edri.org", "educateandcelebrate.org", "educationalpolicy.org", "eei.org", "eetfoundation.org", "eewc.com", "efa.org.au", "efc.ca", "eff.org", "egale.ca", "egaliteetreconciliation.fr", "ejp.eu", "ekklesiaproject.org", "elaw.org", "electionscience.org", "electoral-reform.org.uk", "ellabakercenter.org", "elpc.org", "ema-online.org", "embargoed.org", "emilyslist.org", "emilyslist.org.au", "ems.org", "en.idi.org.il", "en.immi.is", "en.odfoundation.eu", "enar-eu.org", "endeavour.com.au", "endeavourforum.org.au", "endthekilling.ca", "energy-net.org", "engine.is", "english.unica.com.br", "ens.it", "envirolink.org", "environmentamerica.org", "epc.eu", "epic.org", "eqca.org", "equalcitizens.us", "equality-network.org", "equalityarizona.org", "equalityfederation.org", "equalityflorida.org", "equalityhawaii.org", "equalityillinois.org", "equalitymaine.org", "equalitymaryland.org", "equalitymi.org", "equalitync.org", "equalityni.org", "equalitypa.org", "equalitytexas.org", "equalitytrust.org.uk", "equalityutah.org", "equaljusticeunderlaw.org", "equallove.info", "equity.org.uk", "eshelonline.org", "eslp.org", "estatetaxsimplification.org", "estuaries.org", "eswglobal.org", "eta.co.uk", "etcgroup.org", "eurocities.eu", "euromedmonitor.org", "european-pirateparty.eu", "europeanlesbianconference.org", "europeanmovement.co.uk", "europeanmovement.eu", "eurotowns.org", "euthanasia.cc", "everytown.org", "excelined.org", "exodusglobalalliance.org", "expose-news.com", "fabians.org.au", "fair.org", "faireconomy.org", "fairlabor.org", "fairness.org", "fairtax.org", "fairtest.org", "fairuk.org", "fairus.org", "fairvote.ca", "fairvote.org", "fairwisconsin.com", "faithfulwordbaptist.org", "familiesusa.org", "familyequality.org", "familyfirst.org.nz", "familyfund.org.uk", "familyresearchinst.org", "famm.org", "fapa.org", "farenet.org", "farmland.org", "fas.org", "fatalpitbullattacks.com", "fathers-4-justice.org", "fb.org", "fbu.org.uk", "fca.org", "fclu.org", "fcnl.org", "fda.org.uk", "fdd.org", "fear.org", "fedsoc.org", "felgtb.org", "feminist.org", "feministsforlife.org", "fepproject.org", "fern.org", "fflag.org.uk", "ffo.no", "ffrf.org", "fiftyshadesofgay.co.in", "fija.org", "flexyourrights.org", "floridaactioncommittee.org", "floridacarry.org", "flp.com.cn", "fnf.org.uk", "focusonthefamily.ca", "focusonthefamily.com", "foe.org", "foe.org.au", "foe.scot", "foeeurope.org", "foei.org", "foodcomm.org.uk", "fooddemocracynow.org", "footprintnetwork.org", "for.org.uk", "foreffectivegov.org", "forest-trends.org", "foresthistory.org", "forestonline.org", "forhealthfreedom.org", "forl.co.uk", "fortyandeight.org", "forum-asia.org", "forum18.org", "forumforequality.org", "fosbr.org.uk", "fosis.org.uk", "fra.europa.eu", "fractracker.org", "framingredpower.org", "frc.org", "free-eco.org", "freeburmarangers.org", "freebyu.org", "freecongress.org", "freeculture.org", "freedom2b.org", "freedomdefense.typepad.com", "freedomforuminstitute.org", "freedomtomarry.org", "freedomtrain.org", "freedomworks.org", "freeenterpriseactionfund.com", "freemuslims.org", "freespeechcoalition.com", "freesyria.org", "friends-bwca.org", "friends.ca", "friendsofcoal.org", "friendsofsouthasia.org", "friendsofthepeak.org.uk", "frso.org", "ftrf.site-ym.com", "fundwildnature.org", "furd.org", "fusewashington.org", "fwr.de", "gafta.com", "galck.org", "galen.org", "galloways.org.uk", "gapa.org", "gapimny.org", "gardenstateequality.org", "gatestoneinstitute.org", "gaybombay.org", "gayecho.com", "gayleft1970s.org", "gc4hr.org", "geichina.org", "genderrightsmaryland.org", "genprogress.org", "gensqueeze.ca", "geohaz.org", "georgiacarry.org", "getora.org", "getup.org.au", "ggb.org.br", "giffords.org", "gillfoundation.org", "gip-global.org", "glaa.org", "glaad.org", "glad.org", "glapn.org", "glbthistory.org", "glen.ie", "glhalloffame.org", "glifaa.org", "glma.org", "global-vision.net", "globalexchange.org", "globalnetworkinitiative.org", "globalrights.org", "globaltimes.cn", "globalwaterpolicy.org", "globio.org", "glsen.org", "gmb.org.uk", "gmcdp.com", "gnu.rep.kp", "godhatesfags.com", "golosbeslana.ru", "gonh.org", "gop.com", "gop.gov", "gopac.org", "gotmercury.org", "gp.org", "gpg.com", "gpus.org", "granma.cu", "grassrootscampaigns.com", "greenamerica.org", "greenforall.org", "greeninstitute.net", "greenmap.org", "greenpeacefoundation.org", "grtl.org", "gsanetwork.org", "gsinstitute.org", "gsrat.net", "gswar1812.org", "gulflabor.org", "gunowners.org", "gunvictimsaction.org", "handsoffvenezuela.org", "handsupunited.org", "hatter.hu", "havruta.org.il", "hbf.co.uk", "hcav.am", "healthcare-now.org", "healthcoalition.ca", "healtheffects.org", "healthliberationnow.com", "heartland.org", "heimssyn.is", "heinzctr.org", "helem.net", "helsinki.org.rs", "henshaws.org.uk", "heritage.org", "heritageaction.com", "highways.org", "hinduamerican.org", "hirschfeld-eddy-stiftung.de", "hkcd.com", "hlc.org", "hobsonspledge.nz", "hollywoodrepublicans.com", "home.isi.org", "home60515.com", "hookersforhillary.com", "hopenothate.org.uk", "hoshen.org", "hot-dog.org", "hotline.org.tw", "housefreedomfund.com", "hpfhr.org", "hqudc.org", "hrc.org", "hrnicholls.com.au", "hrrc.org", "hsdems.org", "huanqiu.com", "huckpac.com", "hudson.org", "humansandnature.org", "humsafar.org", "iacenter.org", "iamroadsmart.com", "ianz.org.nz", "iaovc.org", "iava.org", "iccl.ie", "icit-digital.org", "icmec.org", "idcpc.org.cn", "iea.org.uk", "ieer.org", "ienearth.org", "iera.org", "iest.org", "ifamericansknew.org", "ifconews.org", "ihlia.nl", "ihra.org.au", "ihrc.org.uk", "iiaba.net", "ijdh.org", "ijvcanada.org", "ilga-europe.org", "ilga.org", "ilglaw.org", "ilisu.org.uk", "illinoisfamily.org", "ilvoices.com", "imamsonline.com", "immigrantjustice.org", "immigrationcontrol.org", "immigrationequality.org", "inar.ie", "inc.ie", "incite-national.org", "inclusive-church.org.uk", "incr.com", "independentmercia.org", "independentpartyofdelaware.com", "individualist.org.uk", "indivisible.org", "indybay.org", "indypride.org", "informinc.org", "instaurationonline.com", "institute.global", "insurgence.net", "inter-lgbt.org", "interactadvocates.org", "interfaithalliance.org", "internationaldisabilityalliance.org", "internetassociation.org", "investigativeproject.org", "ioby.org", "ionainstitute.ie", "ipco.org.br", "ipjustice.org", "ips-dc.org", "iranhumanrights.org", "iraqhurr.org", "irelanduscouncil.com", "iri.org", "irishnationalcaucus.org", "irqr.ca", "isb.org.uk", "islamic-sharia.org", "islamicforumeurope.com", "islamicinformationcenter.org", "islamicparty.com", "israelcampusroundtable.org", "israeliamerican.org", "israellawcenter.org", "itgetsbetter.org", "iusw.org", "ivaw.org", "iwa.wales", "iwdc.org", "iwf.org", "iwgb.org.uk", "iwgia.org", "iwla.org", "iww.org", "jacpac.org", "jamaicansforjustice.org", "jclu.org", "jcpa.org", "jcua.org", "jesuitvolunteers.org", "jewishdems.org", "jflag.org", "jobcreatorsnetwork.com", "joeacanfora.com", "joh.org.il", "johnsinclair.us", "jpfo.org", "jqyouth.org", "jstreet.org", "jubileeusa.org", "justiceaction.org.au", "justiceatstake.org", "justicedemocrats.com", "kairospalestine.ps", "kaleidoscopeaustralia.com", "kansasequalitycoalition.org", "kaosgldernegi.org", "keepirelandopen.org", "keepsundayspecial.org.uk", "kentuckyfairness.org", "keshetonline.org", "kff.org", "kftc.org", "kgreens.org", "khrc.net", "kickitout.org", "kingidentity.com", "kisa.org.cy", "knightsout.org", "knowthyneighbor.org", "koebergalert.org", "komalainternational.org", "korematsuinstitute.org", "kph.org.pl", "krf.no", "kurdwatch.ezks.org", "kvener.no", "kyequality.org", "la-articles.org.uk", "labi.org", "labourcampaignforelectoralreform.org.uk", "labourleave.org.uk", "labrisz.hu", "labucketbrigade.org", "lac.org.na", "lambdaistanbul.org", "lambdalegal.org", "lambdaliterary.org", "landrights.org", "landtrustalliance.org", "lanuovaecologia.it", "lasvegaspride.org", "latin-amerikagruppene.no", "latinainstitute.org", "latinovictory.us", "lavoisier.com.au", "lawcf.org", "lawyerscommittee.org", "lbda.org", "lc.org", "ldausa.org", "ldfi.org.uk", "leadershipinstitute.org", "league.org.uk", "leagueofthesouth.com", "learnaboutsam.org", "leave.eu", "leavemeansleave.eu", "legabibo.org", "legacy.com.au", "legalmomentum.org", "legion.org", "legit.ca", "lesbianavengers.com", "lespantheresroses.org", "levice.cz", "lfi.org.uk", "lgbt-cicilline.house.gov", "lgbt-ep.eu", "lgbt.dk", "lgbt.foundation", "lgbt.libdems.org.uk", "lgbt.org.il", "lgbtbar.org", "lgbtcampus.org", "lgbtconservatives.org.uk", "lgbtconsortium.org.uk", "lgbtihealth.org.au", "lgbtlabour.org.uk", "lgbtnet.org", "lgbtory.ca", "lgbtpride.or.kr", "lgcm.org.uk", "lgpregioncentre.org", "lgsm.org", "liberal.ca", "liberalforum.eu", "liberalreform.org.uk", "libertycoalition.net", "licra.org", "lifeafterhate.org", "lifechain.org", "lifecharity.org.uk", "lifewatch.org", "littlesisters.ca", "liveaction.org", "liverpoolmuslimsociety.org.uk", "livingstongroupdc.com", "livingstreets.org.uk", "lmbtszovetseg.hu", "lnt.org", "lobbying-register.uk", "lobbyingtransparency.org", "logcabin.org", "londoncenter.org", "lpradicals.org", "lrta.org", "lsvd.de", "lulac.org", "luxembourgforum.org", "lwv.org", "lwvmissouri.org", "m4bl.org", "mabonline.net", "macedonian.org", "madagascarfaunaflora.org", "madd.ca", "madd.org", "maderasrfc.org", "maggieslist.org", "mainewomen.org", "malcolm-x.org", "maldef.org", "manager.co.th", "mankind.org.uk", "mapa.org", "maquilasolidarity.org", "marchforlife.org", "marchforourlives.com", "marriageequality.org", "marxists.org", "massequality.org", "massresistance.org", "masstpc.org", "matthewshepard.org", "mcb.org.uk", "mccl.org", "mcli.org", "mdac.org", "meatinstitute.org", "mecc.org", "medact.org", "mediamatters.org", "mediawatchuk.org.uk", "meemgroup.org", "meforum.org", "mencap.org.uk", "mfc.org", "mfso.org", "mglc.org.au", "michaeljournal.org", "migrationpolicy.org", "migrationwatchuk.org", "militaryreligiousfreedom.org", "milkclub.org", "milkfoundation.org", "millionpuppetmarch.com", "milwaukeeurbangardens.org", "minab.org.uk", "mindfreedom.org", "minhajuk.org", "miningwatch.ca", "minutemanhq.com", "minutemanproject.com", "miphealth.org.uk", "miscarriagesofjustice.org", "missionamerica.com", "mla.com.au", "mlagb.com", "mlcsl.co.uk", "moaa.org", "moboysstate.org", "monarchist.ca", "monarchist.org.au", "monarchyinternational.net", "montrosecenter.org", "moreunited.org.uk", "mosse.nl", "motherearthwaterwalk.com", "mothersforpeace.org", "mothersunion.org", "motorists.org", "mountainjustice.org", "moveon.org", "movetoamend.org", "movimentgraffitti.org", "mpac.org", "mpacuk.org", "mpirg.org", "mpp.org", "mrap.fr", "mtst.org", "museumsgalleriesscotland.org.uk", "musiciansunion.org.uk", "muslim-ed-trust.org.uk", "muslimalliance.org", "musliminstitute.org", "muslimsforamerica.us", "naacp.org", "naaee.org", "naafa.org", "naar.org.uk", "nad.org", "nagps.org", "naht.org.uk", "nam.org", "nami.org", "naors.co.uk", "napawf.org", "napo.org", "napo.org.uk", "narcoa.org", "narfe.org", "narsol.org", "nasuwt.org.uk", "nata.aero", "natall.com", "nationalcitizens.ca", "nationalgunrights.org", "nationalhealthcouncil.org", "nationalparentsorganization.org", "nationalparks.org", "nationalpartnership.org", "nationalpitbullvictimawareness.org", "nationalpopularvote.com", "nationalreview.com", "nationaltrust.je", "nationalwomansparty.org", "nationalyounglords.com", "nationformarriage.org", "nativeseeds.org", "natoassociation.ca", "nature.org", "nautilusint.org", "navyleague.org.au", "nawbo.org", "nazandmattfoundation.org", "nazindia.org", "nbjc.org", "ncac.org", "ncbl.org", "nccm.ca", "nchc.org", "nclc.org", "nclrights.org", "ncnw.org", "ncoa.org", "ncpssm.org", "ncseglobal.org", "ncsj.org", "nct.org.uk", "ncta.com", "ncusar.org", "ncwit.org", "ndn.org", "neaction.org", "nebraskafamilyalliance.org", "necnp.org", "neco.org", "neea.org", "negawatt.org", "nei.org", "network23.org", "networklobby.org", "neu.org.uk", "nevadadesertexperience.org", "newamerica.org", "newconservative.org.nz", "newdealleaders.org", "newleaderscouncil.org", "newonline.org", "news.cn", "news.tvb.com", "newsds.org", "nfb.org", "nfrw.org", "nftc.org", "nglcc.org", "niacouncil.org", "nif.org", "nifla.org", "nilc.org", "niot.org", "nippon-mirai.jp", "nirs.org", "njdc.org", "nlc.org", "nlgja.org", "nmp.org.uk", "no2id.net", "nodeathpenalty.org", "noglstp.org", "noi.org", "noisefree.org", "nomoredeaths.org", "norpac.net", "northernplains.org", "notdeadyet.org", "now.org", "nowar-paix.ca", "noyafieldsfamily.org", "noyb.eu", "npalliance.org", "npca.org", "npcuk.org", "npg.org", "nprcouncil.org", "nqapia.org", "nra.org", "nrcm.org", "nrdc.org", "nrep.org", "nrlc.org", "nrpa.org", "nrsc.org", "nsm88.org", "nsr.no", "nsra.co.uk", "nssf.org", "nswbc.org", "nswp.org", "ntd.com", "ntu.org", "nuj.org.uk", "nujp.org", "nul.org", "numbersusa.com", "nwhn.org", "nwsc.org.hk", "nyabn.org", "nyacyouth.org", "nyclu.org", "nycommunities.org", "nycparentsunion.org", "nylpi.org", "nypirg.org", "nysrpa.org", "nyyrc.com", "nzoss.org.nz", "oathkeepers.org", "ocap.ca", "oceanarksint.org", "oceanchampions.org", "oclp.hk", "ohiolife.org", "ohpi.org.au", "oiac.org", "omnicenter.org", "oneinten.org", "oneiowa.org", "oneparty.net", "onepeoplesproject.com", "onevirginia2021.org", "onewisconsinnow.org", "ontariohealthcoalition.ca", "openrightsgroup.org", "opensource.org", "opensourceecology.org", "operationrescue.org", "operationsaveamerica.org", "originalelf.com", "orionsociety.org", "osiny.org", "ostem.org", "ourrevolution.com", "outa.co.za", "outandequal.org", "outfront.org", "outhistory.org", "outrage.org.uk", "outserve-sldn.org", "oxcis.ac.uk", "paaia.org", "pacificlegal.org", "pagop.org", "palestinecampaign.org", "palmettofamily.org", "pana.ie", "panewsmedia.org", "parentstv.org", "parity-uk.org", "parkfoundation.org", "patentfairness.org", "patentsmatter.com", "patrioticmillionaires.org", "paxchristi.net", "pcar.org", "pcs.org.uk", "pdamerica.org", "peaceandtolerance.org", "peacehost.net", "peccapics.com", "peer.org", "pennies.org", "pensionrights.org", "people.cn", "people.ie", "peopleandplanet.org", "peoples-vote.uk", "peoplesaction.org", "peoplespolicyproject.org", "perc.org", "peregrinefund.org", "pfaw.org", "pflag.org", "pflagcanada.ca", "pgi.org", "pgib.ca", "pheasantsforever.org", "philrights.org", "phtv.ifeng.com", "picturethehomeless.org", "pinkdot.sg", "piraadipartei.ee", "pirateparty.org.uk", "pirati.cz", "plagal.org", "planestupid.com", "plannedparenthood.org", "plasticpollutioncoalition.org", "plq.org", "pnhp.org", "pnrra.org", "poauk.org.uk", "polarisinstitute.org", "policyresearch.org.uk", "pomnim.com", "pop.org", "popcouncil.org", "populardemocracy.org", "populareconomics.org", "population.org.au", "populationconnection.org", "populationmatters.org", "potomacriverkeepernetwork.org", "power2010.org.uk", "powerupfilms.org", "pp-international.net", "pravdabeslana.ru", "prb.org", "prc.org.uk", "preservationaction.org", "presstv.co.uk", "presstv.com", "presstv.ir", "presstv.tv", "prideatwork.org", "prideinstem.org", "prideistanbul.org", "pridenw.org", "priestsforlife.org", "proasyl.de", "prochoiceamerica.org", "programmersguild.org", "progressivelibrariansguild.org", "progressivemajority.org", "progressivemaryland.org", "progressivepolicy.org", "progressjersey.blogspot.com", "progressnow.org", "progressonline.org.uk", "projectnooneleaves.org", "prolifeaction.org", "prolifecampaign.ie", "promoonline.org", "propagandacritic.com", "prospect.org.uk", "protect.org", "protectingtaxpayers.org", "proudpolitics.org", "prwatch.org", "psaonline.org", "psr.org", "psywar.org", "publicadvocateusa.org", "publicgardens.org", "publicinterestlegal.org", "publicinterestwatch.org", "publicknowledge.org", "publiclab.org", "publicpolicypolling.com", "publicspace.ca", "publishwhatyoupay.org", "pucl.org", "pudr.org", "pureearth.org", "purplestrategies.com", "pwd.org.au", "qcea.org", "qhalloffame.ca", "queermontenegro.org", "queersagainstapartheid.org", "quilliaminternational.com", "quintessenz.at", "r2k.org.za", "rac.org", "racearchive.manchester.ac.uk", "racfoundation.org", "racingpride.com", "radabnr.org", "radicalmiddle.com", "radiosawa.com", "railfuture.org.uk", "railpassengers.org", "railusers.ie", "rainbowhealth.org", "rainbowpush.org", "rainbowrailroad.ca", "rainforest-alliance.org", "rainn.org", "rapecrisis.org.uk", "rare.org", "raspberrypi.org", "rationalist.org.uk", "rc.org", "rcrc.org", "rdi.org", "realwomenca.com", "reclaimpridenyc.org", "redactionarchive.org", "redbetances.com", "redeemthevote.com", "redfish.media", "redice.tv", "reducespending.org", "refugeassociation.org", "refugeerights.org", "refuseandresist.org", "reichsbanner.de", "releaseinternational.org", "religiousliberty.info", "renegadebroadcasting.com", "renewparty.org.uk", "representwomen.org", "reproductiverights.org", "republic.org.uk", "republicanassemblies.org", "republicanmainstreet.org", "republicansabroad.no", "respectabilityusa.com", "rethinkvenezuela.com", "reverb.org", "rewilding.org", "rfa.org", "rferl.org", "rff.org", "rideauinstitute.ca", "rightnowwomen.org", "rightsandresources.org", "righttolife.org.nz", "rinj.org", "riponsociety.org", "rjchq.org", "rlc.org", "rmef.org", "rmgo.org", "rmt.org.uk", "rnclife.org", "rnha.org", "rnib.org.uk", "rnla.org", "robinwood.de", "rockthevote.com", "rootstrikers.org", "rosefdn.org", "royaldeaf.org.uk", "royaljersey.co.uk", "rsf.org", "rslc.gop", "rslnational.org", "rstreet.org", "rt.com", "rt.rs", "ruptly.tv", "russiatoday.com", "russiatoday.ru", "rutherford.org", "rwjf.org", "ry.org.nz", "sabin.org", "sacc.org.uk", "sacom.hk", "sacouncil.com", "sacred-texts.com", "saf.org", "safeschoolscoalition.org.au", "safespeed.org.uk", "safinacenter.org", "safs.ca", "saha.org", "saldef.org", "salganyc.org", "samaracanada.com", "samas.no", "samtokin78.is", "sanfound.org", "sapphokolkata.in", "sarahpac.com", "save.lgbt", "savecalifornia.com", "saveoursuburbs.org.au", "saveplants.org", "saverestaurants.com", "savethefish.org", "savetheinternet.com", "sba-list.org", "scaife.com", "scci.org", "scdi.org.uk", "scenic.org", "schoolandstate.org", "science.cleapss.org.uk", "scope.org.uk", "scotch-whisky.org.uk", "scotlandfoodanddrink.org", "scotlandinunion.co.uk", "scottishrenewables.com", "scottishwildlifetrust.org.uk", "scv.org", "seafoodwatch.org", "seaplanes.org", "searchneutrality.org", "secularprolife.org", "secure.actblue.com", "sempervirens.org", "senateconservatives.com", "sentencingproject.org", "sepp.org", "servicemembersunited.org", "seta.fi", "severnside-rail.org.uk", "sexualminoritiesuganda.com", "sfcommunityhealth.org", "sfe.org.uk", "sgr.org.uk", "shiarightswatch.org", "shovalgroup.org", "sian.no", "siecus.org", "sierraclub.org", "sikhcoalition.org", "silentnomoreawareness.org", "sinosz.hu", "siol-nan-gaidheal.org", "sistersong.net", "skytruth.org", "slp.at", "smokiesinformation.org", "snakeriveralliance.org", "snapnetwork.org", "snccdigital.org", "snd-us.com", "snowbirds.org", "snp.org", "soaw.org", "socialist.news", "socialistalternative.org", "socialliberal.net", "socialplanningtoronto.org", "societe-jersiaise.org", "societyofauthors.org", "socm.org", "solidarity-party.org", "solidaritytradeunion.org", "sortirdunucleaire.org", "sos-homophobie.org", "sos-racisme.org", "sos-rasisme.no", "soulforce.org", "sourds-socialistes.fr", "southallblacksisters.org.uk", "southeasternlegal.org", "southerncouncil.org", "southernenvironment.org", "southernersonnewground.org", "spannertrust.org", "sparcopen.org", "sparkle.org.uk", "splcenter.org", "spoc.ca", "spokes.org.nz", "sportetcitoyennete.com", "spreadtheword.global", "spuc.org.uk", "sputnik.by", "sputnik.kz", "sputniknews.cn", "sputniknews.com", "sputniknews.ru", "squatter.org.uk", "srf.org", "srlp.org", "srtrc.org", "ssbx.org", "sst.org.nz", "stand.earth", "standupamericanow.org", "standwithmainstreet.com", "standwithus.com", "startout.org", "statecraft.org.uk", "steel.org", "stellamaris.no", "stiftung-marktwirtschaft.de", "stipdelft.nl", "stonewall.org.uk", "stonewallyoungdems.org", "stophateuk.org", "stopracism.ca", "storybookdads.org.uk", "strandreleasing.com", "streetroots.org", "strongerin.co.uk", "strongtowns.org", "struggle.pk", "stud.cz", "studentpeaceaction.org", "studentsforliberty.org", "studentsforlife.org", "survivedandpunished.org", "survivorsoftorture.org", "sustainus.org", "sustrans.org.uk", "svlg.org", "svn.org", "swcs.org", "swiftvets.com", "swopusa.org", "swords-to-plowshares.org", "syriantaskforce.org", "t4america.org", "taayush.org", "takebacktheland.org", "takungpao.com.hk", "talltimbers.org", "taxpayer.net", "taxpayers.org.au", "taxpayersalliance.com", "tbha.org", "tc-america.org", "tchrd.org", "teachers.org.uk", "teamlpac.com", "technyc.org", "teenagerepublicans.org", "tehila.org.il", "televisionwatch.org", "tellus.org", "terreform.org", "texascivilrightsproject.org", "tfa.net", "tfdp.net", "tfn.org", "tfp.org", "theacru.org", "theadvocates.org", "theamericanfreedomparty.us", "theaoi.com", "theatlanticbridge.com", "theawarenesscenter.blogspot.com", "thecall.com", "theccf.co.uk", "thecep.org.uk", "thechicagourbanleague.org", "thecitycircle.com", "thecityuk.com", "theclearinghouse.org", "thecondomproject.org", "thecornerhouse.org.uk", "thecre.com", "thefire.org", "thefpa.co.uk", "thegsba.org", "theicarusproject.net", "theicct.org", "theisraelproject.org", "thelawfareproject.org", "thenrai.in", "theoceanproject.org", "thepaper.cn", "thepeoplesassembly.org.uk", "thepfa.com", "thepinktriangletrust.com", "theraf.org", "therapeuticchoice.com", "therightstuff.biz", "therpa.co.uk", "thesca.org", "thesisters.org", "thesocialcontract.com", "thestreettrust.org", "thesurvivorstrust.org", "thetanuxi.org", "thetaskforce.org", "thetruthaboutguns.com", "theunia-acl.com", "thomasmore.org", "thomasmoresociety.org", "tides.org", "times-up.org", "tlw.org", "tnep.org", "togetherforyes.ie", "torchantifa.org", "torontoenvironment.org", "tpl.org", "tpusa.com", "traditionalbritain.org", "trainridersne.org", "transactivists.org", "transafrica.org", "transequality.org", "transgendervictoria.com", "translifeline.org", "transmediawatch.org", "transparencycanada.ca", "transportaction.ca", "transstudent.org", "treatmentadvocacycenter.org", "trees.org", "trevvy.com", "tridentploughshares.org", "truecolorsunited.org", "truthinscience.org.uk", "truthwinsout.org", "ttcriders.ca", "tuc.org.uk", "tv.cctv.com", "uaf.org.uk", "uavs.org", "ucfsga.com", "ucp.org", "ucsa.org", "ucsusa.org", "ucu.org.uk", "ukma.org.uk", "uknda.org", "umaamerica.net", "unac.org", "und.nodak.edu", "unipd-centrodirittiumani.it", "unison.org.uk", "uniteamerica.org", "unitedagainstnucleariran.com", "unitedfamilies.org", "unitedforpeace.org", "unitedsikhs.org", "unitetheunion.org", "universalhealthct.org", "unlockdemocracy.org.uk", "unponteper.it", "upstate-citizens.org", "urbaneden.org", "usacc.org", "usaction.org", "usas.org", "uschamber.com", "uscib.org", "usdaw.org.uk", "usgbc.org", "usglc.org", "usinpac.com", "uspsa.org", "usstudents.org", "uvwunion.org.uk", "uyghuramerican.org", "vabio.org", "vanmierlostichting.d66.nl", "vcdl.org", "vda.de", "veteransforbritain.uk", "vfa.de", "vfw.org", "victimsofcommunism.org", "victoryfund.org", "videofag.com", "villagecommunityboathouse.org", "vimeo.com/45479858", "viscardicenter.org", "visionamerica.us", "vlv.org.uk", "vob.org", "voewg.at", "voiceforlife.org.nz", "voiceofrussia.com", "voiceproject.org", "voicetheunion.org.uk", "voteleavetakecontrol.org", "voyageurs.org", "vpc.org", "vshl.org", "vvaw.org", "vvn-bda.de", "warresisters.org", "washingtonmainstream.org", "washingtonpeacecenter.org", "waspi.co.uk", "wasuproject.org.uk", "water1st.org", "waterforsouthsudan.org", "waterkeeper.org", "wenweipo.com", "westernjournalism.com", "wheatworld.org", "whitecoats4blacklives.org", "whiterose.saddleworth.net", "wiesenthal.com", "wild.org", "wildearthguardians.org", "wilderness.org", "wildlandsnetwork.org", "wildlifealliance.org", "wildlifemessengers.org", "wildmontana.org", "wildwhiteclouds.org", "wise-paris.org", "wokingmuslim.org", "womenagainstregistry.org", "womensaid.org.uk", "womensway.org", "wordonfire.org", "worldcongress.org", "worldfederalistscanada.org", "worldsurfingreserves.org", "writersguild.org.uk", "wrj.org", "wwctu.org", "wws.org", "xinhuanet.com", "xinmin.cn", "xnet-x.net", "y.dsausa.org", "yaf.com", "yaf.org", "yaffed.org", "yazda.org", "yct.org", "yda.org", "ydnc.org", "yesforwales.com", "yfoundations.org.au", "yorkshireridingssociety.org.uk", "youcanplayproject.org", "youthunlimited.org", "yre.org.uk", "yrnf.com"], "blogs": ["africanprintinfashion.com", "austinemedia.com", "bellanaija.com", "blog.naver.com", "blogger.com", "buzznigeria.com", "gmusicplus.com", "habr.com", "helpdeskgeek.com", "highstakesdb.com", "informationng.com", "insider.foxnews.com", "lindaikejisblog.com", "livejournal.com", "medium.com", "nickiswift.com", "npr.org/blogs", "patribotics.blog", "politicalticker.blogs.cnn.com", "ratingsryan.com", "techdirt.com", "unrevealedfiles.com", "youthvillageng.com"], "books": ["books.google.com"], "community": ["digitaljournal.com", "examiner.com", "globalvoices.org", "newsparticipation.com", "wikinews.org", "wikitribune.com"], "editable": ["boardgamegeek.com", "commons.wikimedia.org", "discogs.com", "fandom.com", "gamepedia.com", "imdb.com", "incubator.wikimedia.org", "localwiki.org", "mediawiki.org", "meta.wikimedia.org", "miraheze.org", "namu.wiki", "orthodoxwiki.org", "planetmath.org", "rigvedawiki.net", "species.wikimedia.org", "unionpedia.org", "wikia.com", "wikia.org", "wikibooks.org", "wikicities.com", "wikidata.org", "wikihow.com", "wikinews.org", "wikipedia.org", "wikiquote.org", "wikisource.org", "wikitech.wikimedia.org", "wikitravel.org", "wikiversity.org", "wikivoyage.org", "wiktionary.org"], "government": ["aa.com.tr", "admin.ch", "agenciabrasil.ebc.com.br", "bernama.com", "bjd.com.cn", "bjreview.com", "cctvplus.com", "cgtn.com", "chinaculture.org", "chinadaily.com.cn", "chinadailyasia.com", "chinadailyhk.com", "chinanews.com", "cna.com.tw", "cri.cn", "dvidshub.net", "ecns.cn", "focustaiwan.tw", "gc.ca", "globaltimes.cn", "gmw.cn", "go.id", "go.jp", "go.kr", "gob", "gob.", "gouv", "gouv.", "gov", "gov.", "govt", "govt.", "gub", "gub.", "gv.at", "hina.hr", "hkcd.com", "huanqiu.com", "iana.ir", "icana.ir", "ifengus.com", "irib.ir", "irna.ir", "kcna.kp", "kcna.kp", "kenyanews.go.ke", "kpl.net.la", "mil", "mil.", "nan.ng", "news.cn", "news.vnanet.vn", "people.cn", "pia.gov.ph", "pna.gov.ph", "presstv.co.uk", "presstv.com", "presstv.ir", "presstv.tv", "rg.ru", "ria.ru", "ria.ru", "rtvm.gov.ph", "shanghaidaily.com", "shine.cn", "state.nj.us", "tass.com", "tass.ru", "tdh.gov.tm", "telam.com.ar", "voanews.com", "xinhuanet.com", "россиясегодня.рф"], "news": ["7news.com.au", "9news.com.au", "abc.es", "abc.net.au/news", "abcnews.com", "abcnews.go.com", "afr.com", "aljazeera.com", "aljazeera.net", "amarujala.com", "ap.org", "apnews.com", "articles.latimes.com", "bangkokpost.com", "bbc.co.uk", "bbc.com", "bhaskar.com", "boston.com", "businessmirror.com.ph", "bworldonline.com", "cbc.ca/news", "cbcnews.ca", "cbsnews.com", "chicagotribune.com", "citynews.ca", "cnbc.com", "cnn.com", "cnnespanol.cnn.com", "cnnindonesia.com", "cnnphilippines.com", "content.time.com", "couriermail.com.au", "csmonitor.com", "ctvnews.ca", "dailytelegraph.com.au", "dailythanthi.com", "derstandard.at", "diariodealmeria.es", "diepresse.com", "dispatch.com", "eenadu.net", "elconfidencial.com", "elcorreo.com", "elcorreogallego.es", "eldiario.es", "elmundo.es", "elpais.com", "elperiodico.cat", "elperiodico.com", "euronews.com", "faz.net", "foxnews.com", "ft.com", "gazeta.pl", "globalnews.ca", "gmanetwork.com/news", "guardian.co.uk", "guardian.com", "haaretz.co.il", "haaretz.com", "herald.ie", "heraldsun.com.au", "huffingtonpost.ca", "huffingtonpost.co.uk", "huffingtonpost.com", "huffingtonpost.com.au", "huffingtonpost.de", "huffpost.com", "huffpostbrasil.com", "humanite.fr", "ici.radio-canada.ca/info", "independent.co.uk", "independent.ie", "inquirer.net", "interaksyon.com", "irishexaminer.com", "irishtimes.com", "jagran.com", "japantimes.co.jp", "jpost.com", "kompas.com", "kompas.id", "koreaherald.com", "koreatimes.co.kr", "krone.at", "kurier.at", "kyodonews.net", "la-croix.com", "lapresse.ca", "latimes.com", "lavanguardia.com", "lavozdegalicia.es", "ledevoir.com", "lefigaro.fr", "lemonde.fr", "leparisien.fr", "liberation.fr", "livehindustan.com", "macleans.ca", "malaymail.com", "manilastandard.net", "manilatimes.net", "manoramaonline.com", "mathrubhumi.com", "mb.com.ph", "mercurynews.com", "msnbc.msn.com", "nationmultimedia.com", "nbcnews.com", "newrepublic.com", "news.abs-cbn.com", "news.sky.com", "news.yahoo.com", "newsweek.com", "npr.org", "nst.com.my", "nytimes.com", "nzherald.co.nz", "oregonlive.com", "phillymag.com", "philstar.com", "politico.com", "politico.eu", "post-gazette.com", "press.co.nz", "qz.com", "rappler.com", "reuters.com", "sacbee.com", "salon.com", "sandiegouniontribune.com", "sbs.com.au/news", "seattlepi.com", "seattletimes.com", "sfchronicle.com", "sfgate.com", "slate.com", "smh.com.au", "spiegel.de", "starbulletin.com", "straitstimes.com", "sueddeutsche.de", "tagesspiegel.de", "telegraph.co.uk", "theage.com.au", "theatlantic.com", "theaustralian.com.au", "thedailybeast.com", "thedailystar.net", "theglobeandmail.com", "theguardian.co.uk", "theguardian.com", "theherald.com.au", "thehill.com", "thehindu.com", "thejakartapost.com", "thestar.com", "thestar.com.my", "thesundaytimes.co.uk", "thetimes.co.uk", "time.com", "timesofindia.indiatimes.com", "timesonline.co.uk", "tribune.net.ph", "tribuneindia.com", "usatoday.com/story", "usnews.com", "vox.com", "washingtonexaminer.com", "washingtonpost.com", "welt.de", "wsj.com", "wyborcza.pl", "yediot.co.il", "ynet.co.il", "ynetnews.com", "zeit.de"], "opinions": ["archive.nytimes.com/roomfordebate.blogs.nytimes.com", "nytimes.com/roomfordebate", "roomfordebate.blogs.nytimes.com", "theguardian.com/commentisfree"], "predatory": ["academicjournals.com", "academicjournals.net", "academicjournals.org", "academicpub.org", "academicresearchjournals.org", "aiac.org.au", "aicit.org", "alliedacademies.org", "arcjournals.org", "ashdin.com", "aspbs.com", "avensonline.org", "biomedres.info", "biopublisher.ca", "bowenpublishing.com", "ccsenet.org", "cennser.org", "chitkara.edu.in", "clinmedjournals.org", "cluteinstitute.com", "cosmosscholars.com", "cpinet.info", "cscanada.net", "davidpublisher.org", "etpub.com", "eujournal.org", "grdspublishing.org", "growingscience.com", "hanspub.org", "hoajonline.com", "hrmars.com", "iacsit.org", "iamure.com", "idosi.org", "igi-global.com", "iises.net", "imedpub.com", "informaticsjournals.com", "innspub.net", "intechopen.com", "intechweb.org", "interesjournals.org", "internationaljournalssrg.org", "ispacs.com", "ispub.com", "julypress.com", "juniperpublishers.com", "kowsarpub.com", "kspjournals.org", "m-hikari.com", "macrothink.org", "mecs-press.org", "medcraveonline.com", "oapublishinglondon.com", "oatext.com", "omicsonline.org", "ospcindia.org", "researchleap.com", "sapub.org", "scholarpublishing.org", "scholink.org", "scialert.net", "scidoc.org", "sciedu.ca", "sciencedomain.org", "sciencedomains.org", "sciencepg.com", "sciencepub.net", "sciencepubco.com", "sciencepublication.org", "sciencepublishinggroup.com", "scipg.net", "scipress.com", "scirp.org", "scopemed.com", "sersc.org", "sphinxsai.com", "ssjournals.com", "thesai.org", "waset.org", "witpress.com", "worldwidejournals.com", "xandhpublishing.com", "xiahepublishing.com", "zantworldpress.com"], "press": ["1888pressrelease.com", "acnnewswire.com", "eprnews.com", "express-press-release.net", "gov.uk/government/news", "home.treasury.gov/news", "icrowdnewswire.com", "infoxen.com", "marketpressrelease.com", "newsvoir.com", "newswire.com/newsroom", "openpr.com/news", "pr.com/article", "pressat.co.uk", "prmac.com", "prnewswire.co.uk", "prnewswire.com", "prunderground.com", "prurgent.com", "prweb.com/releases", "theopenpress.com", "verticalnewsnetwork.com", "webwire.com"], "rspBlacklisted": ["banned.video", "batteryuniversity.com", "bestgore.com", "biggovernment.com", "breitbart.com", "company-histories.com", "examiner.com", "famousbirthdays.com", "fundinguniverse.com", "globalresearch.ca", "globalresearch.org", "healthline.com", "infowars.com", "infowars.net", "infowars.tv", "lenta.ru", "liveleak.com", "lulu.com", "mondialisation.ca", "mylife.com", "naturalnews.com", "newstarget.com", "newswars.com", "opindia.com", "opindia.in", "reunion.com", "swarajyamag.com", "thepointsguy.com", "thepointsguy.com/news", "thepointsguy.com/reviews", "veteranstoday.com", "zoominfo.com"], "rspDeprecated": ["anna-news.info", "armeniasputnik.am", "b.baidu.com", "baike.baidu.com", "banned.video", "bestgore.com", "bharat.republicworld.com", "biggovernment.com", "breitbart.com", "cgtn.com", "cinemos.com", "crunchbase.com", "dailycaller.com", "dailycallernewsfoundation.org", "dailym.ai", "dailymail.co.uk", "dailymail.co.uk/mailonsunday", "dailymail.com.au", "dailystar.co.uk", "dreamteamfc.com", "epoch.org.il", "epochtimes.com", "findarticles.com/p/news-articles/daily-mail-london-england-the", "frontpagemag.com", "frontpagemagazine.com", "glitchwave.com", "globaltimes.cn", "healthline.com", "hispantv.com", "hispantv.ir", "huanqiu.com", "infowars.com", "infowars.net", "infowars.tv", "jihadwatch.org", "journal-neo.org", "last.fm", "lenta.ru", "lifesitenews.com", "mailonsunday.co.uk", "mailplus.co.uk", "mintpressnews.cn", "mintpressnews.com", "mintpressnews.es", "mintpressnews.ru", "nationalenquirer.com", "newsblaze.com", "newsblaze.com.au", "newsbreak.com", "newsmax.com", "newsmaxtv.com", "newsoftheworld.co.uk", "newsoftheworld.com", "newswars.com", "nndb.com", "ntd.com", "ntdtv.ca", "ntdtv.com", "ntdtv.com.tw", "oann.com", "occupydemocrats.com", "okeefemediagroup.com", "pressreader.com/ireland/irish-daily-mail", "pressreader.com/uk/daily-mail", "pressreader.com/uk/scottish-daily-mail", "pressreader.com/uk/the-mail-on-sunday", "pressreader.com/uk/the-scottish-mail-on-sunday", "presstv.com", "presstv.ir", "projectveritas.com", "rateyourmusic.com", "redfish.media", "republicworld.com", "royalcentral.co.uk", "rt.com", "rt.rs", "ruptly.tv", "russiatoday.com", "russiatoday.ru", "sonemic.com", "sputnik.by", "sputnik.kz", "sputniknews.cn", "sputniknews.com", "sputniknews.ru", "sunnation.co.uk", "takimag.com", "telesurenglish.net", "telesurtv.net", "the-sun.com", "theepochtimes.com", "thegatewaypundit.com", "thegrayzone.com", "thescottishsun.co.uk", "thestar.ie", "thesun.co.uk", "thesun.ie", "thesun.mobi", "thisismoney.co.uk", "travelmail.co.uk", "unz.com", "unz.org", "vdare.com", "veteranstoday.com", "voiceofrussia.com", "voltairenet.org", "wapbaike.baidu.com", "wnd.com", "worldnetdaily.com", "zerohedge.com"], "rspGenerallyReliable": ["abcnews.com", "abcnews.go.com", "adl.org", "afp.com", "aljazeera.com", "aljazeera.net", "amnesty.org", "amnesty.org.ph", "aon.com", "ap.org", "apnews.com", "arstechnica.co.uk", "arstechnica.com", "avclub.com", "avn.com", "axios.com", "bbc.co.uk", "bbc.com", "behindthevoiceactors.com", "bellingcat.com", "bloomberg.com", "burkespeerage.com", "businessweek.com", "buzzfeednews.com", "catalyst-journal.com", "climatefeedback.org", "cnn.com", "codastory.com", "commonsensemedia.org", "csmonitor.com", "deadline.com", "deadlinehollywooddaily.com", "debretts.com", "deseretnews.com", "digitalspy.co.uk", "digitalspy.com", "dw.com/en", "economist.com", "engadget.com", "ew.com", "ft.com", "gamasutra.com", "gamedeveloper.com", "gameinformer.com", "gamerankings.com", "gizmodo.com", "grubstreet.com", "guardian.co.uk", "haaretz.co.il", "haaretz.com", "hollywoodreporter.com", "idolator.com", "ifcncodeofprinciples.poynter.org", "ign.com", "independent.co.uk", "indianexpress.com", "ipscuba.net", "ipsnews.net", "ipsnoticias.net", "iranicaonline.org", "jacobinmag.com", "jamanetwork.com", "journalism.org", "kirkusreviews.com", "kommersant.com", "kommersant.ru", "kommersant.uk", "latimes.com", "metacritic.com", "mg.co.za", "monde-diplomatique.fr", "mondediplo.com", "motherjones.com", "msnbc.com", "nationalgeographic.com", "nbcnews.com", "newrepublic.com", "news.sky.com", "news.yahoo.com", "newscientist.com", "newslaundry.com", "newyorker.com", "npr.org", "nydailynews.com", "nymag.com", "nytimes.com", "nzherald.co.nz", "people-press.org", "people.com", "pewforum.org", "pewglobal.org", "pewhispanic.org", "pewinternet.org", "pewresearch.org", "pewsocialtrends.org", "pinknews.co.uk", "playboy.com", "politico.com", "politifact.com", "polygon.com", "propublica.org", "qz.com", "rappler.com", "reason.com", "religionnews.com", "reuters.com", "rfa.org", "rottentomatoes.com", "rte.ie", "sciencebasedmedicine.org", "scientificamerican.com", "scmp.com", "scotusblog.com", "slate.com", "slate.fr", "smh.com.au", "snopes.com", "space.com", "spiegel.de", "splcenter.org", "telegraph.co.uk", "theage.com.au", "theatlantic.com", "theaustralian.com.au", "theconversation.com", "thecut.com", "thediplomat.com", "theglobeandmail.com", "theguardian.co.uk", "theguardian.com", "thehill.com", "thehindu.com", "theintercept.com", "thejc.com", "themarysue.com", "thenation.com", "theregister.co.uk", "thesundaytimes.co.uk", "thetimes.co.uk", "theverge.com", "thewire.in", "thewirehindi.com", "thewireurdu.com", "thewrap.com", "time.com", "timesonline.co.uk", "torrentfreak.com", "tvguide.com", "tvguidemagazine.com", "usatoday.com", "usnews.com", "vanityfair.com", "variety.com", "venturebeat.com", "voanews.com", "vogue.com", "vox.com", "vulture.com", "washingtonpost.com", "weeklystandard.com", "wired.co.uk", "wired.com", "wsj.com", "wyborcza.pl", "zdnet.com"], "rspGenerallyUnreliable": ["112.international", "112.ua", "adfontesmedia.com", "alternet.org", "amazon.ca", "amazon.cn", "amazon.co.jp", "amazon.co.uk", "amazon.com", "amazon.com.au", "amazon.com.br", "amazon.com.mx", "amazon.com.sg", "amazon.com.tr", "amazon.de", "amazon.es", "amazon.fr", "amazon.in", "amazon.it", "amazon.nl", "ancestry.com", "anphoblacht.com", "answers.com", "antiwar.com", "antiwar.org", "antwerpen-indymedia.be", "arxiv.org", "askubuntu.com", "batteryuniversity.com", "bigmuddyimc.org", "bild.de", "bitterwinter.org", "blogspot.com", "broadwayworld.com", "californiaglobe.com", "celebritynetworth.com", "cesnur.net", "cesnur.org", "chat.openai.com", "cnsnews.com", "coindesk.com", "company-histories.com", "conservativereview.com", "consortiumnews.com", "council.rollingstone.com", "counterpunch.com", "counterpunch.org", "cracked.com", "crwflags.com", "dailykos.com", "dailysabah.com", "dailywire.com", "discogs.com", "electronicintifada.net", "examiner.com", "express.co.uk", "facebook.com", "familysearch.org", "famousbirthdays.com", "fandom.com", "findagrave.com", "findmypast.co.uk", "flickr.com", "fotw.info", "fundinguniverse.com", "gawker.com", "gbnews.com", "gbnews.uk", "geni.com", "globalresearch.ca", "globalresearch.org", "globalsecurity.org", "goodreads.com", "heatst.com", "history.com", "ibtimes.co.in", "ibtimes.co.uk", "ibtimes.com", "ibtimes.com.au", "ibtimes.com.cn", "ibtimes.sg", "imc-africa.mayfirst.org", "imdb.com", "indybay.org", "indymedia.ie", "indymedia.nl", "indymedia.no", "indymedia.org", "indymedia.org.uk", "indymedia.us", "indymediapr.org", "inquisitr.com", "investopedia.com", "jewishvirtuallibrary.org", "joshuaproject.net", "knowyourmeme.com", "linkedin.com", "livejournal.com", "liveleak.com", "lulu.com", "marquiswhoswho.com", "mashable.com/ad", "mathoverflow.net", "mediabiasfactcheck.com", "medium.com", "metal-archives.com", "metal-experience.com", "metro.co.uk", "metro.news", "michiganimc.org", "midiaindependente.org", "mondialisation.ca", "mrc.org", "mrctv.org", "mylife.com", "naturalnews.com", "newsbusters.org", "newstarget.com", "nypost.com", "opindia.com", "opindia.in", "order-order.com", "ourcampaigns.com", "pagesix.com", "panampost.com", "patheos.com", "phillyimc.org", "pressreader.com/uk/daily-express", "prnewswire.co.uk", "prnewswire.com", "quadrant.org.au", "quillette.com", "quora.com", "rawstory.com", "reddit.com", "redstate.com", "researchgate.net", "reunion.com", "rogueimc.org", "rollingstone.com/culture-council", "scribd.com", "serverfault.com", "skwawkbox.org", "sourcewatch.org", "spirit-of-metal.com", "sportskeeda.com", "stackexchange.com", "stackoverflow.com", "starsunfolded.com", "statista.com", "superuser.com", "swarajyamag.com", "tass.com", "tass.ru", "theblaze.com", "thecanary.co", "thefederalist.com", "thenewamerican.com", "theonion.com", "thepostmillennial.com", "thetruthaboutguns.com", "tnimc.org", "tunefind.com", "tv.com", "tvtropes.org", "twitter.com", "ucimc.org", "ukwhoswho.com", "urbandictionary.com", "venezuelanalysis.com", "vgchartz.com", "victimsofcommunism.org", "weather2travel.com", "wegotthiscovered.com", "westernjournal.com", "whatculture.com", "whosampled.com", "whoswhoinamerica.com", "wikia.com", "wikia.org", "wikicities.com", "wikidata.org", "wikileaks.org", "wikinews.org", "wikipedia.org", "wordpress.com", "worldometers.info", "youtube.com", "zoominfo.com"], "rspMarginallyReliable": ["about.com", "alexa.com", "allgame.com", "allmovie.com", "allmusic.com", "allsides.com", "aninews.in", "api.parliament.uk/historic-hansard", "arabnews.com", "askmen.com", "aspi.org.au", "ballotpedia.org", "biography.com", "bloomberg.com/profile", "boingboing.net", "britannica.com", "businessinsider.com", "bustle.com", "cato.org", "cepr.net", "chinadaily.com.cn", "chinadailyasia.com", "chinadailyhk.com", "cliffsnotes.com", "cosmopolitan.com", "dailydot.com", "dailynk.com", "democracynow.org", "entrepreneur.com", "eonline.com", "fair.org", "genius.com", "globalreligiousfutures.org", "google.com/maps", "gordonconwell.edu", "guinnessworldrecords.com", "hansard.millbanksystems.com", "hansard.parliament.uk", "heavy.com", "hk.appledaily.com", "hopenothate.org.uk", "humanevents.com", "ijr.com", "islamqa.info", "jezebel.com", "lifewire.com", "maps.google.com", "mashable.com", "mdpi.com", "mediaite.com", "mediamatters.org", "metalsucks.net", "mirror.co.uk", "mondoweiss.net", "morningstaronline.co.uk", "nationalreview.com", "news.cn", "parliament.uk", "pewresearch.org/religion/2015/04/02/religious-projection-table", "pewresearch.org/religion/2015/04/02/religious-projections-2010-2050", "pride.com", "quackwatch.org", "rapgenius.com", "realclearinvestigations.com", "realclearpolitics.com", "refinery29.com", "rian.com.ua", "rian.ru", "salon.com", "scienceblogs.com", "screenrant.com", "searchlightmagazine.com", "sherdog.com", "skepdic.com", "skynews.com.au", "softpedia.com", "sparknotes.com", "spectator.co.uk", "spectator.us", "standard.co.uk", "straitstimes.com", "techcrunch.com", "theamericanconservative.com", "thearda.com", "thebalance.com", "thedailybeast.com", "thegreenpapers.com", "theneedledrop.com", "thenextweb.com", "thepointsguy.com/news", "thepointsguy.com/reviews", "thespruce.com", "thinkprogress.org", "thoughtco.com", "timesofindia.com", "timesofindia.indiatimes.com", "tmz.com", "townhall.com", "tripsavvy.com", "trtworld.com", "usmagazine.com", "verywell.com", "verywellfamily.com", "verywellhealth.com", "verywellmind.com", "vice.com", "vicetv.com", "washingtonexaminer.com", "washingtontimes.com", "worldchristiandatabase.org", "worldreligiondatabase.org", "wsws.org", "xbiz.com", "xinhuanet.com"], "rspMulti": ["aa.com.tr", "buzzfeed.com", "cnet.com", "forbes.com", "foxbusiness.com", "foxnews.com", "geonames.nga.mil", "geonames.usgs.gov", "huffingtonpost.ca", "huffingtonpost.co.uk", "huffingtonpost.com", "huffingtonpost.com.au", "huffingtonpost.com.mx", "huffingtonpost.de", "huffingtonpost.es", "huffingtonpost.fr", "huffingtonpost.gr", "huffingtonpost.in", "huffingtonpost.it", "huffingtonpost.jp", "huffingtonpost.kr", "huffpost.com", "huffpostbrasil.com", "huffpostmaghreb.com", "insider.com", "memri.org", "memritv.org", "newsweek.com", "rollingstone.com", "sixthtone.com", "thisisinsider.com"], "satire": ["babylonbee.com", "burrardstreetjournal.com", "mousetrapnews.com", "newyorker.com/humor", "onlysky.media", "private-eye.co.uk", "spacexmania.com", "thebeaverton.com", "thedailymash.co.uk", "theonion.com"], "social": ["9gag.com", "facebook.com", "instagram.com/p", "linkedin.cn", "linkedin.co.id", "linkedin.co.nz", "linkedin.co.uk", "linkedin.com.ar", "linkedin.com.br", "linkedin.com.gt", "linkedin.com.hk", "linkedin.com.mx", "linkedin.com.ni", "linkedin.com.pk", "linkedin.com.py", "linkedin.com.sv", "linkedin.com/in", "pinterest.at", "pinterest.be", "pinterest.biz", "pinterest.ca", "pinterest.cl", "pinterest.co.uk", "pinterest.com.au", "pinterest.com.ec", "pinterest.com.mx", "pinterest.dk", "pinterest.es", "pinterest.hu", "pinterest.in", "pinterest.it", "pinterest.jp", "pinterest.nl", "pinterest.nz", "pinterest.pe", "pinterest.ph", "pinterest.tw", "reddit.com/r", "tiktok.com", "tumblr.com", "twitter.com", "vk.com", "youtube.com/watch?v="], "sponsored": ["amny.com/sponsored", "ctvnews.ca/sponsored-content", "gq.com/sponsored", "lamag.com/sponsored", "lfpress.com/sponsored", "mashable.com/ad", "nationalpost.com/sponsored", "newsweek.com/sponsored", "seattletimes.com/sponsored", "thestar.com/sponsored_sections", "vancouverisawesome.com/sponsored", "wired.com/insights"], "tabloids": ["ahaonline.cz", "bild.de", "blesk.cz", "dailymail.co.uk", "dailyrecord.co.uk", "dailystar.co.uk", "express.co.uk", "globaltimes.cn", "globemagazine.com", "heraldweekly.com", "huanqiu.com", "intouchweekly.com", "mirror.co.uk", "nationalenquirer.com", "pressreader.com/uk/daily-express", "radaronline.com", "starmagazine.com", "sundaymail.co.uk", "thesun.co.uk", "usmagazine.com"], "tvPrograms": ["abc.com/shows", "bbc.co.uk/programmes", "cnn.com/videos", "pbs.org/video", "video.foxnews.com"] };
    let categorizedStrings = { "advocacy": [], "blogs": [], "books": [], "community": ["-irpt"], "editable": ["/wiki/"], "government": [], "news": [], "opinions": ["/opinion/", "/opinions/"], "predatory": [], "press": [], "satire": [], "sponsored": [], "rspDeprecated": [], "rspGenerallyUnreliable": [], "social": [], "tabloids": [], "tvPrograms": [] };


    // An empty version of categorizedDomains that will hold domains that are found on the page:
    let filteredCategorizedDomains = {
        "advocacy": [],
        "blogs": [],
        "books": [],
        "community": [],
        "editable": [],
        "government": [],
        "news": [],
        "opinions": [],
        "predatory": [],
        "press": [],
        "rspBlacklisted": [],
        "rspDeprecated": [],
        "rspGenerallyReliable": [],
        "rspGenerallyUnreliable": [],
        "rspMarginallyReliable": [],
        "rspMulti": [],
        "satire": [],
        "social": [],
        "sponsored": [],
        "tabloids": [],
        "tvPrograms": []
    };

    // Default toggle settings:
    let citeUnseenCategories = {
        "advocacy": true,
        "blogs": true,
        "books": true,
        "community": true,
        "editable": true,
        "government": true,
        "news": true,
        "opinions": true,
        "predatory": true,
        "press": true,
        "rspBlacklisted": true,
        "rspDeprecated": true,
        "rspGenerallyReliable": false,
        "rspGenerallyUnreliable": true,
        "rspMarginallyReliable": true,
        "rspMulti": true,
        "satire": true,
        "social": true,
        "sponsored": true,
        "tabloids": true,
        "tvPrograms": true
    };

    let citeUnseenCategoryData = {
        "advocacy": {
            "label": "advocacy",
            "type": "influence",
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAPCAMAAAA1b9QjAAAAbFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB0Iv+qAAAAI3RSTlMA1A5E+vZW38mMJx7s2aOZjWdaQzoUCvHkyrmvhXx2bWBTMqn0tOoAAAB/SURBVBjTZc9XDoQwDARQZzc9lKVub/j+d8SMAIGYH8svsSXTLt1D7WFwzKctfAxD4hmx4camUiKB1zwjTWIYUeGXiERamt8v0kLyg7hl6v7+d5CGSl6ii4TN1H6l87YqM77WEIoihdT+pVlDepEce5tsvsILWVDyDrWW3xBkBEQGDke/jOMVAAAAAElFTkSuQmCC",
            "count": 0
        },
        "blogs": {
            "label": "blogs",
            "type": "user-generated",
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAMAAAAMs7fIAAAAclBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACa4vOeAAAAJXRSTlMA+/J3Bq43Mxb3x7OnnJl8Xkoc6ubLoVhNPCgj3dzDkI1ycVZUCH5LxQAAAJZJREFUGBkFwYVhAgEAALG84A51t9t/xSaG2/3DeQ0AVQ27ZwCqqnavAD9f+7uqxkcALI9D1QlYXme8LqpOoMb9E6ah+oWqtiv+hhqvqKrNmalaYL2a3qse2VVLME9DbVZehloAnob64FibtXk6XJiqi+fq7KG6mN9qz60OxurIqUYWtXVffbOsrj7rzst2PMysq5Wpxn9NeBK2TnaptgAAAABJRU5ErkJggg==",
            "count": 0
        },
        "books": {
            "label": "book(s)",
            "type": "medium",
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAMCAMAAACz+6aNAAAAWlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACLSV5RAAAAHXRSTlMAqt7QCRnpffrWSSry7cehoHVuRD0sJuLamGkfHurrquoAAABVSURBVAjXvYjJEYAgEMBWQO5bxHP7b1OBsQXzSSago5KSHAWq8NzRqIHnC1hN1lthGNwnBwKdgnoE/Q7D+ZdjlrWd5nY2wRGRZEz7aycUhKmjJB0RHg2VBO5eX4k3AAAAAElFTkSuQmCC",
            "count": 0
        },
        "community": {
            "label": "community",
            "type": "user-generated",
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAQCAMAAADH72RtAAAAaVBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAnbPKNAAAAInRSTlMAmWPM27eThIB/06+fjV0lD/r1yLuzqaRzTD8dmGpTUBYCKhLQsAAAAH1JREFUGNONi0kOAjEMBGMgCUy22VfW/v8jiU3EaQ5TUkvlkqz2qI3fRDYfapEAjCIDYEUM4NRc6aSBIOU9ufQCUKVhkq94JzIWmYWIHh+1gjnldSNbVOyobOz92jVZr1Jmc2b0sy2lyRN6XUp7K+XiuDD/wsfhstAPq3b5AqlTD1RMmHJ5AAAAAElFTkSuQmCC",
            "count": 0
        },
        "editable": {
            "label": "editable",
            "type": "user-generated",
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAPCAMAAADeWG8gAAAAvVBMVEUAAABMTEw1NTUdHR0+Pj7o6Oj///8/Pz8pKSkuLi5TU1NXV1dcXFxiYmKMjIywsLDExMT///////9tbW0xMTFfX19KSkpFRUVUVFRMTExHR0dZWVlgYGBra2taWlp2dnaEhIRsbGxmZmZ8fHygoKCOjo6Dg4OqqqqXl5ekpKSmpqacnJyhoaG7u7unp6ezs7O7u7vHx8ft7e3///////8AAAAjIyMGBgZUVFRHR0cLCwtlZWVOTk4iIiIVFRWrycPlAAAANXRSTlMA9P7++R8F/v798+rm3rFcOwkC/v38+PHt7e3r6efi397e1My6uberoZOLh4Z9cnFZMSggDCg5MJMAAACOSURBVBgZXcGFEoJQAATAe6SUgt3dXUcZ//9ZMgYM7iJ1HRzxZ0L/jExJ2AuyiIwq0X+wqyFVHpF3Go11GT8r8sagTdonfLgyw4A9JuSlhoRn8lmlKPKtub8AM7JG2dUEP2KUAlbIrXoo8AsmdSmSCjFT2A31kDnAnFHdUBRFiJZl9R1nDHT8DfK8qYq8F7oKGQbJNCvvAAAAAElFTkSuQmCC",
            "count": 0
        },
        "government": {
            "label": "government",
            "type": "influence",
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAMAAAAMs7fIAAAAY1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABmaHTeAAAAIHRSTlMAqrX79++886/r3wjRxaFpRB8QAuXk2cuZkY93VUI0KKnnAu0AAABkSURBVBjTrchHDoMwAAXRT+w4obf0UOb+pwRhhACx5EmzGXl18/pWWikSIPzHmnUOL8prjcqPYfFudaTMgpVCUgYRS09JASZ22KmUqz+6Y3XhNnbmScGFmDlbqWcr14+tRA92BiEuELFwk9M6AAAAAElFTkSuQmCC",
            "count": 0
        },
        "news": {
            "label": "news",
            "type": "type",
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAMAAAAMs7fIAAAAYFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD6T+iNAAAAH3RSTlMAupk7insrItNVS0O/F28fZWFF48uxSDIMCO+0oIAO/8GCqwAAAIBJREFUGNOdy9sSwiAMRdEDFGmQS6Gttd74/78UkXTGV9dDZrInQXK3RTCXAAhkjcPqgTtOA/LYELQCxuk5wJ8b3wpRGKK1dld1mE9B/ZpKKYZCCNtP8THGFxclpfS6jswFBy4X0dG/N1yS/FpW2ctjM50DcBXYHZq2VOTmWTD1Bls+BmmlzBpEAAAAAElFTkSuQmCC",
            "count": 0
        },
        "opinions": {
            "label": "opinion piece(s)",
            "type": "type",
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAOCAMAAAD+MweGAAAAb1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABt6r1GAAAAJHRSTlMA+xH1Iph8OCYY3MWiLe/p1sq8lI53cGxiV0EM6rGwj2pNSjP1ocsVAAAAgUlEQVQIHV3BRQLCMABFwZ+m7q447/5nJC3dwIzizODYetYpA0yfbN5BjgHGV8qXzTcBdWyBISkaIBCQP4DWu84FUCmFIARugxljwOhpCUJ2U5IBRrqzhOyiDsdIfaiJXdfglNJbig1OFODkOiwXoLRA6+mU+E6RsuqXX636E0X6AFnuEKR6+rcNAAAAAElFTkSuQmCC",
            "count": 0
        },
        "predatory": {
            "label": "predatory journal(s)",
            "type": "influence",
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAOCAMAAAAVBLyFAAAAmVBMVEUAAAC/AADAAADAAADAAAC/AAC+AAC/AAC/AAC/AAC/AADAAAC/AAC/AAC/AADAAAC/AADAAAC/AAC/AADEAAC/AADXYWHRS0vMOTnGHh7AAADAAAC+AAC/AAC/AADGAAC/AAD////XXFzHHx/++vr77u733NzQRETMNDTJJibDEBD99vb78PD55ubzzs7xyMjuurrSTEzBCQmtvS+6AAAAIHRSTlMApFWZXe5mRPU1085j39zWnol3Jw/49PPy8ObFloBsCQk/Lh0AAACMSURBVBjTVY7nDsIwDAYdoNCkaeliL6fpZvP+D0djBZHer9NZlj6QU+KUXc5HI7EEFs8NqYjCcO/56DNgMyAyDwnvnyDCd4td4aZlU96Ku1q7qX8qpeqdkwQ2Qxo9irZSpbpunBTo+qFf1dZNqHv8dOYxWRh4HqCBpqKduLLCgE+Iw3CXZBwseZr8/AvR2g1q3xyaTQAAAABJRU5ErkJggg==",
            "count": 0
        },
        "press": {
            "label": "press release(s)",
            "type": "type",
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAOCAMAAAD+MweGAAAAPFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADQLyYwAAAAE3RSTlMAzHczU/m4lm8wHL6timZBPQwdu570zwAAAFxJREFUCNetyDkOw0AMBEGS5p663f//q1eioUCxKhhgWi4lAanI7WBx94Xjep9ho46tbOcRnt4sOhEm/Zd1J+zrWVTVm4bmY6SatW6hN7MqGeZCKDNk+eYEt5T7D9g7DD/ysJyVAAAAAElFTkSuQmCC",
            "count": 0
        },
        "rspBlacklisted": {
            "label": "blacklisted",
            "type": "reliability",
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAWlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD////u7u7o6OgpKSkMDAy0tLT7+/v5+fl+fn58fHw5OTklJSUhISG1tbWsrKyjo6MkJCR7e3s8PDxKkGAPAAAACnRSTlMAvI4+GrPi4bSxfq7qvQAAAHZJREFUCNddj0sSwjAMQ/MtICexk/QDFO5/TXDpgol2b0a2JKPyLkbnzU/B4pANB03gLtIZk7LFO1WimhbY7x04PdacyzMxvHHotWAvWNsMZ664Uy7AlkkQTfzH22nedhQ1D680aEmNqGnQWWMWeTEuYSw5TPgAC+IHcILUzWIAAAAASUVORK5CYII=",
            "count": 0
        },
        "rspDeprecated": {
            "label": "deprecated",
            "type": "reliability",
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAMAAAAMs7fIAAAAq1BMVEUAAAAUBQUTBQWzJCT///+uIyOwIyOsIiJKEBBLDw9wFhZsFRVHDg67u7tgLS2OIiLLy8ttWVlkPj5kKyv6+vry8vLu7u7j4+Pc3NzX19e3t7eysrKdmJhpVFRhNzdWNDR6IyOhISHp6eno5+fY1tbDw8O6tbWqqamoqKiakJCQkJCQhYWKfX1lSkpYPj5aNTVEMjJnMDBcLy99KiqDKCimISGWICBAHBwsGRlV2YqAAAAAA3RSTlMAp597gGAlAAAAqklEQVQY02XQ1xKCMBAFUHE3BBUSlCLSsffe/v/LTLIjL9ynzJk7s5vt6fTdgY5rqTfBiNs6fGi1ACBFA8AUGWDAg2v4fRqiRvPxc9wXQORygGCTeOiNQYW7PYcBlLOpkccNmGNkQiKPJ7CV2Er8beZlxTkWbSdBxGi5OLz/nVLBPMXwAqpDsyLEFHEn9Syzj8wRVxhX7YoM7mtEv3oR0Na1EDUj6P69e58fVvYMNLFQgRAAAAAASUVORK5CYII=",
            "count": 0
        },
        "rspGenerallyReliable": {
            "label": "generally reliable",
            "type": "reliability",
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAbFBMVEUAAAAsoCwsoSw+qD4toS0roCstoi0uoS4snyw8qDwtoC0toC0soCwuny4toC0toC3///8voi8toS0soCzo9egyozLp9enj8+PD5MORzZGOzI5GrEa/4r/e8N7M6Mxxv3FBqkH0+vTy+fLE5cSRPYNXAAAAEHRSTlMAsxr9vo4/5JD9wbw/PeaP9lvV4AAAAIVJREFUCNclzlsWgyAMBFBQRKu1TXgp+Gy7/z2WgfniHpKTEchzkHLQoqYZrWlbY1VT9OIYiELkHh55pZKVVd6zser8JKvFYEL985cznZAtfU+i3W8LPSR4+V8R+DZhuT1DGNY20nFvjoiSnYVQ+dAB7TyhRs8pyyXUgFUtOUGI7qTsZrz+IPgKG81qz+sAAAAASUVORK5CYII=",
            "count": 0
        },
        "rspGenerallyUnreliable": {
            "label": "generally unreliable",
            "type": "reliability",
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAASFBMVEUAAADMAADMAADPAADMAADMAADMAADNAADMAADNAAD////MAAD99fXsnp7pj4/nhobib2/RGBjia2vojY3jcXHYPz/YPDzRGhqXVefLAAAACnRSTlMA8c8VVPOChINSyGF/kwAAAHJJREFUCNc9z9sSwyAIRVGQaFLAVs3t//+0gE3325pxnANYtKac00YQLXgftbaOS0hOZUuHmAlP2TkaSLDe+pZPUHuBdDA/bgly5b8rAhrDk6nxz/F46/rYvyIcHO1yIfmMMWdc8poje4uRJo+Kn1D8hC/MLAbL8liTMwAAAABJRU5ErkJggg==",
            "count": 0
        },
        "rspMarginallyReliable": {
            "label": "marginally reliable",
            "type": "reliability",
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAOCAMAAAAR8Wy4AAAAjVBMVEUAAAD2eQD1eQD2eQD1eQD1eQD1eQD1eAD0eQD0eAD4egDycwD/gAD/cgD1egD1eQD1eQD1eQD1eQD2eQD2eQD0egD0eAD////4nUX1eQD2fgn3kSz3jCTj4N/96tf82LWYmJj7yJb7xI6Li4v5tG9ra2tZWVlISEj2hBT+9+/+9u7GxsbFxcVHR0dGRkYfNpgQAAAAF3RSTlMAu/lq7uDVenUuJBQJBMOvrZaUVFJHRoWjpJIAAAB/SURBVAgdVcEHFoIwEAXAJaEXu3429I71/sczKvJghiZS0oovhE9LW6V2tHDmuuYLzSI7ybLUjuhPcvEcCpY0CcwYrwGxGdDPXuXoe+TqQF+eaIGuA1rh0cdmvAKPO3AbDdKOXAFoGgAVn4hCK4FWltASKySX03iWskuOseK8AfKLCvyhOfkVAAAAAElFTkSuQmCC",
            "count": 0
        },
        "rspMulti": {
            "label": "sometimes reliable",
            "type": "reliability",
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAtFBMVEUAAAAJrd8gteIPsOAAqt0Aq90Aqt0Aqts4veUkt+IWsuAuuuMErN4FrN4ErN4Cq94Cq90Aqt0Aqt8Aqd4Aqt4AqtwApt8Zs+EEq94FrN0Dqt0Dq94AqdwAq90Aqd0Aqd4AqtkAqt8AgP////8Aqt1NxOj1/P74/f7m9/zb8/rE6/e86faq4/Sn4vOc3vKQ2vB70+5Xx+k+v+bs+fzk9vvU8fnO7/iW3PFozetYyOkktuIas+C+oCNVAAAAI3RSTlMA/fv7oJuWI/v7+/rh0MO4tXZGNScSC/vuzb6pjH9xTRsYAtfMWVAAAACbSURBVAjXJctXEsJQCEBRXmKipjd7F9J77Lr/fYnP+8HMGQC480Fz1noA/8Y2TV+9Qs5RajktMMuwXFgn5kq5JDFRnFwNFyCgEjtR16LDikLQFcS2QewHRHUHboxcevs8EScj8CRjemeSW0NySPhE+BBSxSwKHg+KADw15y2/3MUIAGaW2qR5nrTCnsPPGxKmKUhjySJf0/dj4L7guBKsqi+5hQAAAABJRU5ErkJggg==",
            "count": 0
        },
        "satire": {
            "label": "satirical",
            "type": "type",
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAARCAYAAAAG/yacAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5wceCDI64ByhXQAAAPFJREFUKM+V0zFKQ0EQBuBvn4pWClaWYiF6Ck+Qy+Qi6VLkFNbpxEOYMoQQrCRqY0h8azML6+NJ4g/LMjP/zD/8y8IYLR4x0I9B1FuME3KH8IoXfOAc97iqCQnfcW9j0lmP0hcanCAXpTaSBduI2yAWtGiKUtMzfYfjnnwrlDadQq5OjQ1yUVg7DOt6jYwJbjDqKI0iP4l4l6piOkApI9XvtKucPIohuTIqFWNSceMfSmAVwXxPwzx4qwazSH7uaSr1GQwrM6Z/NEwrzjDhNLqvg/COJ7zhEg+4qFa8K5Nusei8T/csgteLZyzjaywj/oUf7bdVPf0Xy7cAAAAASUVORK5CYII=",
            "count": 0
        },
        "social": {
            "label": "social site(s)",
            "type": "user-generated",
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAATCAMAAABBexbDAAAAflBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACCtoPsAAAAKXRSTlMAuojOBPt2P/bv1cx9TywM5dnGwKqlaFlWLR0B3rGhmY9sRDYkElw4GE5gfmkAAAC4SURBVBgZPcGFVsRAEATAnpXbuHvOBej//0Em5JEq7GbPSDwFh0D6M2mXh8MuCFRhm+iDzWKeAlXYS/4N5RpO4voxm+0YV1CGdZCvOEkGmyZPAG/PPEhWNfKyWVIBODFyo7zTLp9tGucAWvJiBGW5FvZ2fQA/nqQRqMIKT8BAZeqTutt2AnClMuT5FdGWANaEypDRjWyhMm5qswklVMxDv2KT8l/n8Gfgzt8ddk64SQMOny7upwWHX849E8nohJh1AAAAAElFTkSuQmCC",
            "count": 0
        },
        "sponsored": {
            "label": "sponsored",
            "type": "influence",
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAASCAYAAAC9+TVUAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5wceCRIMu+B6UQAAAUVJREFUOMuN079KXFEQx/HPVQwqEgIpU2yRzpSBFG7lK+QNtjeNQjqxCYivkCovkfRWQdhlCx9ALGyWgIWBsFl3b5o5MjneKw4Md5j5zu/8m8v/9gXXWGBc1caRvw6u0y7Rhq9SfNuTvyyNa0nkPL4tmtTwKgk0EWf+kR0HtIymVUfcBvdgTYrXA9rCi2iqbQ1/8Sfxj2yUzvyUj/qOcvRMgeJHtcAw3cU8tjyvmnK+3M0wi0wiuaie8gc+4meVL9wki+RC+X7GS7wJ5rSHe3idktxIc/Ia+3iLA9xhN9UL38A0CvfpXlp8iwU28ClEcr3wU2msVx2jfYUPGOBdD3fbhOJ6NfLwHnvYwTbO8LuDW8JNzza/YjMWGOB7z7Fv4CLNQVsBv2I651U+8xdw2POrL6phu+/hDsucnGDWAayS1wKz6PMP8f7HxLFPnyIAAAAASUVORK5CYII=",
            "count": 0
        },
        "tabloids": {
            "label": "tabloid(s)",
            "type": "medium",
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAMAAAAMs7fIAAAAe1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC9eBywAAAAKHRSTlMA33YN9+rLup5pZkU+8drRtKqTjF9aUyslHxsF4tXDwqujmYaBXBQIt6ZAsgAAAH1JREFUGBl1wVUWwjAABMBNUndXXPf+J4TIa39gBv9cCykVdmPIrxa7mloFvOE01DygnWFF1Dyl4jushVoNmQVwyuB88ZMkfQo4vS+jg+qG/ghrbkiKeE2zEEaa0zi9xg7alNMJYUXcZDAENw8YiUenmGAtcVX6IrgNK376AFE7D6Mmxn6bAAAAAElFTkSuQmCC",
            "count": 0
        },
        "tvPrograms": {
            "label": "TV program(s)",
            "type": "medium",
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARAgMAAABGA69pAAAADFBMVEUAAACoqKgAAAA1NTWxW1e8AAAAAnRSTlMAWWQkJGgAAAA4SURBVAjXY2BgaGhgAIJGMPnoAIhUYwABayBmWrVqAQMD16pVKxgYNIAMILlqVRd+EqISogtqAgBQEBiFRNOi6QAAAABJRU5ErkJggg==",
            "count": 0
        }
    };

    // Default source ignore settings:
    citeUnseenDomainIgnore = {};

    citeUnseenRefTotal = 0;

    // Get reflist node:
    reflistNode = document.querySelector('#mw-content-text .mw-parser-output div.reflist');

    // Get the user's custom rules from User:<username>/CiteUnseen-Rules.js
    mw.loader.getScript('/w/index.php?title=User:' + encodeURIComponent(mw.config.get('wgUserName')) + '/CiteUnseen-Rules.js&ctype=text/javascript&action=raw')
        .fail(function (err) {
            console.log("Error getting Cite Unseen custom rules: " + err.message);

            // Start process of adding icons:
            addIcons(categorizedDomains, categorizedStrings);
        })
        .done(function () {
            try {
                // Account for previous config names:
                if (!window.cite_unseen_categories && window.cite_unseen_rules) {
                    window.cite_unseen_categories = window.cite_unseen_rules;
                }
                if (!window.cite_unseen_categories && window.cite_unseen_ruleset) {
                    window.cite_unseen_categories = window.cite_unseen_ruleset;
                }

                // Get user's category configurations:
                if (window.cite_unseen_categories && typeof window.cite_unseen_categories === 'object') {
                    for (let key in window.cite_unseen_categories) {
                        citeUnseenCategories[key] = window.cite_unseen_categories[key];
                    }
                }

                // Get user's domain ignore lists:
                if (window.cite_unseen_domain_ignore && typeof window.cite_unseen_domain_ignore === 'object') {
                    for (let key in window.cite_unseen_domain_ignore) {
                        citeUnseenDomainIgnore[key] = window.cite_unseen_domain_ignore[key];
                    }
                }

                // Get user's custom domains:
                if (window.cite_unseen_additional_domains && typeof window.cite_unseen_additional_domains === 'object') {
                    for (let key in window.cite_unseen_additional_domains) {
                        if (!categorizedDomains[key]) {
                            categorizedDomains[key] = [];
                        }
                        categorizedDomains[key] = categorizedDomains[key].concat(window.cite_unseen_additional_domains[key]);
                    }
                }

                // Get user's custom strings:
                if (window.cite_unseen_additional_strings && typeof window.cite_unseen_additional_strings === 'object') {
                    for (let key in window.cite_unseen_additional_strings) {
                        if (!categorizedStrings[key]) {
                            categorizedStrings[key] = [];
                        }
                        categorizedStrings[key] = categorizedStrings[key].concat(window.cite_unseen_additional_strings[key]);
                    }
                }

                // Start process of adding icons:
                addIcons(categorizedDomains, categorizedStrings);
            } catch (err) {
                console.log('Cite Unseen: Could not read custom rules due to error: ', err);
            }
        });

    function escapeRegex(string) {
        return string.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    function regexBuilder(string) {
        // Given a domain and path, the regex looks for a substring that matches the following rules:
        //  starts with http:// or https://
        //  does not have any additional / before domain
        //  domain immediately follows :// or is preceded with a . (to account for subdomains)
        //  after the domain and path, look for one of the following:
        //	 string ends
        //	 next character is a /
        //	 domain had a period at the end (this allows gov. to match TLDs like gov.uk)
        let regex = new RegExp('https?:\\/\\/([^\\/]*\\.)?' + escapeRegex(string) + '($|((?<=\\.)|\\/))');
        return regex;
    }

    function addIcons(categorizedDomains, categorizedStrings) {
        // Filter categorizedDomains down to just the links that appear in the page's citations
        // Given how many domains we track and our RegExp usage later, this has significant time savings
        // Quick test on an article with ~500 citations went ~5x faster
        let allCitationLinks = [];
        refs.forEach(function (ref) {
            if (ref.nodeName.toLowerCase() === 'a') {
                allCitationLinks.push(ref.getAttribute('href'));
            } else {
                let refLink = ref.querySelector("a.external");
                if (refLink) {
                    allCitationLinks.push(refLink.getAttribute('href'));
                }
            }
        });
        Object.keys(categorizedDomains).forEach(function (key) {
            allCitationLinks.forEach(function (link) {
                categorizedDomains[key].forEach(function (domain) {
                    if (!(citeUnseenDomainIgnore[key] && citeUnseenDomainIgnore[key].includes(domain)) && link.includes(domain)) {
                        filteredCategorizedDomains[key].indexOf(domain) === -1 ? filteredCategorizedDomains[key].push(domain) : null;
                    }
                });
            });
        });

        // Flag for when a source is not news due to being something else:
        let notNews;

        // Flag for when a source has been identified under an RSP category
        // Mainly used to disclude from rspMulti
        let rspSet;

        refs.forEach(function (ref) {
            notNews = false;
            rspSet = false;

            if (ref.classList.contains("book")) {
                if (citeUnseenCategories.books) {
                    processIcon(ref, "book");
                }
            } else {
                let refLink = null;
                if (ref.nodeName.toLowerCase() === 'a') {
                    refLink = ref;
                } else {
                    let link = ref.querySelector("a.external");
                    if (link) {
                        refLink = link;
                    }
                }

                if (refLink) {
                    let externalLink = refLink.getAttribute('href');

                    // Check if ref's first link is in any of our datasets.
                    // Some matches will flag as notNews so that it won't be marked as news, even if there's a match.
                    if (citeUnseenCategories.books && (filteredCategorizedDomains.books.some(el => externalLink.match(regexBuilder(el))) ||
                        categorizedStrings.books.some(el => externalLink.includes(el)))) {
                        processIcon(refLink, "book");
                        notNews = true;
                    }
                    if (citeUnseenCategories.press && (filteredCategorizedDomains.press.some(el => externalLink.match(regexBuilder(el))) ||
                        categorizedStrings.press.some(el => externalLink.includes(el)) || refLink.parentNode.classList.contains("pressrelease"))) {
                        processIcon(refLink, "press");
                        notNews = true;
                    }
                    if (citeUnseenCategories.social && (filteredCategorizedDomains.social.some(el => externalLink.match(regexBuilder(el))) ||
                        categorizedStrings.social.some(el => externalLink.includes(el)))) {
                        processIcon(refLink, "social");
                        notNews = true;
                    }
                    if (citeUnseenCategories.satire && (filteredCategorizedDomains.satire.some(el => externalLink.match(regexBuilder(el))) ||
                        categorizedStrings.satire.some(el => externalLink.includes(el)))) {
                        processIcon(refLink, "satire");
                        notNews = true;
                    }
                    if (citeUnseenCategories.sponsored && (filteredCategorizedDomains.sponsored.some(el => externalLink.match(regexBuilder(el))) ||
                        categorizedStrings.sponsored.some(el => externalLink.includes(el)))) {
                        processIcon(refLink, "sponsored");
                        notNews = true;
                    }
                    if (citeUnseenCategories.community && (filteredCategorizedDomains.community.some(el => externalLink.match(regexBuilder(el))) ||
                        categorizedStrings.community.some(el => externalLink.includes(el)))) {
                        processIcon(refLink, "community");
                        notNews = true;
                    }
                    if (citeUnseenCategories.opinions && (filteredCategorizedDomains.opinions.some(el => externalLink.match(regexBuilder(el))) ||
                        categorizedStrings.opinions.some(el => externalLink.includes(el)))) {
                        processIcon(refLink, "opinion");
                        notNews = true;
                    }
                    if (citeUnseenCategories.blogs && (filteredCategorizedDomains.blogs.some(el => externalLink.match(regexBuilder(el))) ||
                        categorizedStrings.blogs.some(el => externalLink.includes(el)))) {
                        processIcon(refLink, "blog");
                        notNews = true;
                    }
                    if (citeUnseenCategories.editable && (filteredCategorizedDomains.editable.some(el => externalLink.match(regexBuilder(el))) ||
                        categorizedStrings.editable.some(el => externalLink.includes(el)))) {
                        processIcon(refLink, "editable");
                        notNews = true;
                    }
                    if (citeUnseenCategories.government && (filteredCategorizedDomains.government.some(el => externalLink.match(regexBuilder(el))) ||
                        categorizedStrings.government.some(el => externalLink.includes(el)))) {
                        if (!ref.classList.contains("journal")) {
                            processIcon(refLink, "government");
                        }
                    }
                    if (citeUnseenCategories.tabloids && (filteredCategorizedDomains.tabloids.some(el => externalLink.match(regexBuilder(el))) ||
                        categorizedStrings.tabloids.some(el => externalLink.includes(el)))) {
                        processIcon(refLink, "tabloid");
                        notNews = true;
                    }
                    if (citeUnseenCategories.tvPrograms && (filteredCategorizedDomains.tvPrograms.some(el => externalLink.match(regexBuilder(el))) ||
                        categorizedStrings.tvPrograms.some(el => externalLink.includes(el)))) {
                        processIcon(refLink, "tvProgram");
                        notNews = true;
                    }
                    if (citeUnseenCategories.predatory && (filteredCategorizedDomains.predatory.some(el => externalLink.match(regexBuilder(el))))) {
                        processIcon(refLink, "predatory");
                        notNews = true;
                    }
                    if (!notNews && citeUnseenCategories.news) {
                        if (categorizedDomains.news.some(el => externalLink.match(regexBuilder(el))) || categorizedStrings.news.some(el => externalLink.includes(el))) {
                            processIcon(refLink, "news");
                        }
                    }
                    if (citeUnseenCategories.advocacy && (filteredCategorizedDomains.advocacy.some(el => externalLink.match(regexBuilder(el))) ||
                        categorizedStrings.advocacy.some(el => externalLink.includes(el)))) {
                        processIcon(refLink, "advocacy");
                    }
                    if (citeUnseenCategories.rspDeprecated && (filteredCategorizedDomains.rspDeprecated.some(el => externalLink.match(regexBuilder(el))))) {
                        processIcon(refLink, "rspDeprecated");
                        rspSet = true;
                    }
                    if (citeUnseenCategories.rspBlacklisted && (filteredCategorizedDomains.rspBlacklisted.some(el => externalLink.match(regexBuilder(el))))) {
                        processIcon(refLink, "rspBlacklisted");
                        rspSet = true;
                    }
                    if (citeUnseenCategories.rspGenerallyUnreliable && (filteredCategorizedDomains.rspGenerallyUnreliable.some(el => externalLink.match(regexBuilder(el))))) {
                        processIcon(refLink, "rspGenerallyUnreliable");
                        rspSet = true;
                    }
                    if (citeUnseenCategories.rspMarginallyReliable && (filteredCategorizedDomains.rspMarginallyReliable.some(el => externalLink.match(regexBuilder(el))))) {
                        processIcon(refLink, "rspMarginallyReliable");
                        rspSet = true;
                    }
                    if (!rspSet && citeUnseenCategories.rspGenerallyReliable && (filteredCategorizedDomains.rspGenerallyReliable.some(el => externalLink.match(regexBuilder(el))))) {
                        processIcon(refLink, "rspGenerallyReliable");
                        rspSet = true;
                    }
                    if (!rspSet && citeUnseenCategories.rspMulti && (filteredCategorizedDomains.rspMulti.some(el => externalLink.match(regexBuilder(el))))) {
                        processIcon(refLink, "rspMulti");
                        rspSet = true;
                    }
                }
            }
        });

        if (window.cite_unseen_dashboard) {
            outputDashboard();
        }

        console.timeEnd('CiteUnseen runtime');
    }

    function addToCount(node, type) {
        if (reflistNode.contains(node)) {
            citeUnseenRefTotal++;
            citeUnseenCategoryData[type].count = citeUnseenCategoryData[type].count + 1;
        }
    }

    function processIcon(node, type) {
        let iconNode = document.createElement("img");
        iconNode.classList.add("skin-invert");
        switch (type) {
            case "advocacy":
                iconNode.setAttribute("src", citeUnseenCategoryData.advocacy.icon);
                iconNode.setAttribute("alt", "This source is an advocacy organization.");
                iconNode.setAttribute("title", "[Cite Unseen] This source is an advocacy organization.");
                addToCount(node, "advocacy");
                break;
            case "blog":
                iconNode.setAttribute("src", citeUnseenCategoryData.blogs.icon);
                iconNode.setAttribute("alt", "This source is a blog piece.");
                iconNode.setAttribute("title", "[Cite Unseen] This source is a blog piece.");
                addToCount(node, "blogs");
                break;
            case "book":
                iconNode.setAttribute("src", citeUnseenCategoryData.books.icon);
                iconNode.setAttribute("alt", "This source is a published book.");
                iconNode.setAttribute("title", "[Cite Unseen] This source is a published book.");
                addToCount(node, "books");
                break;
            case "community":
                iconNode.setAttribute("src", citeUnseenCategoryData.community.icon);
                iconNode.setAttribute("alt", "This source is community-created news");
                iconNode.setAttribute("title", "[Cite Unseen] This source is community-created news");
                addToCount(node, "community");
                break;
            case "editable":
                iconNode.setAttribute("src", citeUnseenCategoryData.editable.icon);
                iconNode.setAttribute("alt", "This source is editable by the community (such as a wiki).");
                iconNode.setAttribute("title", "[Cite Unseen] This source is editable by the community (such as a wiki).");
                addToCount(node, "editable");
                break;
            case "government":
                iconNode.setAttribute("src", citeUnseenCategoryData.government.icon);
                iconNode.setAttribute("alt", "This source has been identified as state-owned or -controlled media, or is a government source.");
                iconNode.setAttribute("title", "[Cite Unseen] This source has been identified as state-owned or -controlled media, or is a government source.");
                addToCount(node, "government");
                break;
            case "news":
                iconNode.setAttribute("src", citeUnseenCategoryData.news.icon);
                iconNode.setAttribute("alt", "This source is a news article from a reputable news agency.");
                iconNode.setAttribute("title", "[Cite Unseen] This source is a news article from a reputable news agency.");
                addToCount(node, "news");
                break;
            case "opinion":
                iconNode.setAttribute("src", citeUnseenCategoryData.opinions.icon);
                iconNode.setAttribute("alt", "This source is an opinion piece.");
                iconNode.setAttribute("title", "[Cite Unseen] This source is an opinion piece.");
                addToCount(node, "opinions");
                break;
            case "predatory":
                iconNode.setAttribute("src", citeUnseenCategoryData.predatory.icon);
                iconNode.setAttribute("alt", "This source is from a predatory journal.");
                iconNode.setAttribute("title", "[Cite Unseen] This source is from a predatory journal.");
                addToCount(node, "predatory");
                break;
            case "press":
                iconNode.setAttribute("src", citeUnseenCategoryData.press.icon);
                iconNode.setAttribute("alt", "This source is a press release.");
                iconNode.setAttribute("title", "[Cite Unseen] This source is a press release.");
                addToCount(node, "press");
                break;
            case "satire":
                iconNode.setAttribute("src", citeUnseenCategoryData.satire.icon);
                iconNode.setAttribute("alt", "This source publishes satirical content.");
                iconNode.setAttribute("title", "[Cite Unseen] This source publishes satirical content.");
                addToCount(node, "satire");
                break;
            case "sponsored":
                iconNode.setAttribute("src", citeUnseenCategoryData.sponsored.icon);
                iconNode.setAttribute("alt", "This source is sponsored material.");
                iconNode.setAttribute("title", "[Cite Unseen] This source is sponsored material.");
                addToCount(node, "sponsored");
                break;
            case "rspDeprecated":
                iconNode.setAttribute("src", citeUnseenCategoryData.rspDeprecated.icon);
                iconNode.setAttribute("alt", "From WP:RSP: There is community consensus to deprecate this source. It is considered generally unreliable, and use of this source is generally prohibited.");
                iconNode.setAttribute("title", "[Cite Unseen] From WP:RSP: There is community consensus to deprecate this source. It is considered generally unreliable, and use of this source is generally prohibited.");
                addToCount(node, "rspDeprecated");
                break;
            case "rspBlacklisted":
                iconNode.setAttribute("src", citeUnseenCategoryData.rspBlacklisted.icon);
                iconNode.setAttribute("alt", "From WP:RSP: Source is deprecated due to persistent abuse, usually in the form of external link spamming.");
                iconNode.setAttribute("title", "[Cite Unseen] From WP:RSP: Source is deprecated due to persistent abuse, usually in the form of external link spamming.");
                addToCount(node, "rspBlacklisted");
                break;
            case "rspGenerallyUnreliable":
                iconNode.setAttribute("src", citeUnseenCategoryData.rspGenerallyUnreliable.icon);
                iconNode.setAttribute("alt", "From WP:RSP: There is community consensus that this source is questionable in most cases. It may still be used for uncontroversial self-descriptions, or for self-published content from subject-matter experts.");
                iconNode.setAttribute("title", "[Cite Unseen] From WP:RSP: There is community consensus that this source is questionable in most cases. It may still be used for uncontroversial self-descriptions, or for self-published content from subject-matter experts.");
                addToCount(node, "rspGenerallyUnreliable");
                break;
            case "rspMarginallyReliable":
                iconNode.setAttribute("src", citeUnseenCategoryData.rspMarginallyReliable.icon);
                iconNode.setAttribute("alt", "From WP:RSP: This source is marginally reliable, and may be usable depending on context.");
                iconNode.setAttribute("title", "[Cite Unseen] From WP:RSP: This source is marginally reliable, and may be usable depending on context.");
                addToCount(node, "rspMarginallyReliable");
                break;
            case "rspGenerallyReliable":
                iconNode.setAttribute("src", citeUnseenCategoryData.rspGenerallyReliable.icon);
                iconNode.setAttribute("alt", "From WP:RSP: Editors show consensus that this source is reliable in most cases on subject matters in its areas of expertise.");
                iconNode.setAttribute("title", "[Cite Unseen] From WP:RSP: Editors show consensus that this source is reliable in most cases on subject matters in its areas of expertise.");
                addToCount(node, "rspGenerallyReliable");
                break;
            case "rspMulti":
                iconNode.setAttribute("src", citeUnseenCategoryData.rspMulti.icon);
                iconNode.setAttribute("alt", "From WP:RSP: Status of this source varies on one or more factors (such as topic area, author, or time of publication). Refer to WP:RSP for more detail.");
                iconNode.setAttribute("title", "[Cite Unseen] From WP:RSP: Status of this source varies on one or more factors (such as topic area, author, or time of publication). Refer to WP:RSP for more detail.");
                addToCount(node, "rspMulti");
                break;
            case "social":
                iconNode.setAttribute("src", citeUnseenCategoryData.social.icon);
                iconNode.setAttribute("alt", "This source is a social media site, likely a social media post.");
                iconNode.setAttribute("title", "[Cite Unseen] This source is a social media site, likely a social media post.");
                addToCount(node, "social");
                break;
            case "tabloid":
                iconNode.setAttribute("src", citeUnseenCategoryData.tabloid.icon);
                iconNode.setAttribute("alt", "This source is a tabloid article.");
                iconNode.setAttribute("title", "[Cite Unseen] This source is a tabloid article.");
                addToCount(node, "tabloids");
                break;
            case "tvProgram":
                iconNode.setAttribute("src", citeUnseenCategoryData.tvPrograms.icon);
                iconNode.setAttribute("alt", "This source is a television or radio program. Its reliability depends on the individual program.");
                iconNode.setAttribute("title", "[Cite Unseen] This source is a television or radio program. Its reliability depends on the individual program.");
                addToCount(node, "tvPrograms");
                break;
            default:
                break;
        }
        iconNode.style.paddingRight = "5px";
        iconNode.style.width = '100%';
        iconNode.style.maxWidth = "17px";
        iconNode.style.maxHeight = "17px";
        iconNode.style.objectFit = 'contain';
        node.parentNode.prepend(iconNode);
    }

    function outputDashboard() {
        let dashboard = document.createElement('div');
        dashboard.style.border = '1px solid #ccc';
        dashboard.style.marginBottom = '1em';
        dashboard.style.borderRadius = '5px';
        dashboard.style.fontSize = '.8em';
        dashboard.style.display = 'flex';
        dashboard.style.gap = '.5em 1em';
        dashboard.style.flexWrap = 'wrap';
        dashboard.style.padding = '5px';
        dashboard.style.justifyContent = 'center';
        dashboard.style.textAlign = 'center';
        let dashboardTotal = document.createElement('div');
        dashboardTotal.innerText = citeUnseenRefTotal + ' Categorized References';
        dashboardTotal.style.fontSize = '1.2em';
        dashboard.appendChild(dashboardTotal);

        // Output reliability counts:
        let reliabilityCategoryData = filterObjectIncludes(citeUnseenCategoryData, 'type', 'reliability');
        for (const [key, value] of Object.entries(reliabilityCategoryData)) {
            if (value.count > 0) {
                let countNode = document.createElement('div');
                let countIcon = document.createElement('img');
                countIcon.alt = '';
                countIcon.src = value.icon;
                countIcon.width = '17';
                countIcon.style.maxHeight = '18px';
                let countText = document.createElement('span');
                countText.innerText = value.count + ' ' + value.label;
                countText.style.paddingLeft = '5px';
                countNode.appendChild(countIcon);
                countNode.appendChild(countText);
                dashboard.appendChild(countNode);
            }
        }

        // Output influence counts:
        let influenceCategoryData = filterObjectIncludes(citeUnseenCategoryData, 'type', 'influence');
        for (const [key, value] of Object.entries(influenceCategoryData)) {
            if (value.count > 0) {
                let countNode = document.createElement('div');
                let countIcon = document.createElement('img');
                countIcon.alt = '';
                countIcon.src = value.icon;
                countIcon.width = '17';
                countIcon.style.maxHeight = '18px';
                let countText = document.createElement('span');
                countText.innerText = value.count + ' ' + value.label;
                countText.style.paddingLeft = '5px';
                countNode.appendChild(countIcon);
                countNode.appendChild(countText);
                dashboard.appendChild(countNode);
            }
        }

        // Output user generated counts:
        let userGeneratedCategoryData = filterObjectIncludes(citeUnseenCategoryData, 'type', 'user-generated');
        for (const [key, value] of Object.entries(userGeneratedCategoryData)) {
            if (value.count > 0) {
                let countNode = document.createElement('div');
                let countIcon = document.createElement('img');
                countIcon.alt = '';
                countIcon.src = value.icon;
                countIcon.width = '17';
                countIcon.style.maxHeight = '18px';
                let countText = document.createElement('span');
                countText.innerText = value.count + ' ' + value.label;
                countText.style.paddingLeft = '5px';
                countNode.appendChild(countIcon);
                countNode.appendChild(countText);
                dashboard.appendChild(countNode);
            }
        }

        // Output type counts:
        let typeCategoryData = filterObjectIncludes(citeUnseenCategoryData, 'type', 'type');
        for (const [key, value] of Object.entries(typeCategoryData)) {
            if (value.count > 0) {
                let countNode = document.createElement('div');
                let countIcon = document.createElement('img');
                countIcon.alt = '';
                countIcon.src = value.icon;
                countIcon.width = '17';
                countIcon.style.maxHeight = '18px';
                let countText = document.createElement('span');
                countText.innerText = value.count + ' ' + value.label;
                countText.style.paddingLeft = '5px';
                countNode.appendChild(countIcon);
                countNode.appendChild(countText);
                dashboard.appendChild(countNode);
            }
        }

        // Output user generated counts:
        let mediumCategoryData = filterObjectIncludes(citeUnseenCategoryData, 'type', 'medium');
        for (const [key, value] of Object.entries(mediumCategoryData)) {
            if (value.count > 0) {
                let countNode = document.createElement('div');
                let countIcon = document.createElement('img');
                countIcon.alt = '';
                countIcon.src = value.icon;
                countIcon.width = '17';
                countIcon.style.maxHeight = '18px';
                let countText = document.createElement('span');
                countText.innerText = value.count + ' ' + value.label;
                countText.style.paddingLeft = '5px';
                countNode.appendChild(countIcon);
                countNode.appendChild(countText);
                dashboard.appendChild(countNode);
            }
        }

        document.querySelector('#mw-content-text .mw-parser-output').insertBefore(dashboard, reflistNode);
    }

    const filterObjectIncludes = (obj, filter, filterValue) =>
        Object.keys(obj).reduce((acc, val) =>
        (obj[val][filter] !== filterValue ? acc : {
            ...acc,
            [val]: obj[val]
        }
        ),
            {});

    const filterObjectExcludes = (obj, filter, filterValue) =>
        Object.keys(obj).reduce((acc, val) =>
        (obj[val][filter] === filterValue ? acc : {
            ...acc,
            [val]: obj[val]
        }
        ),
            {});

}

runCiteUnseen();
