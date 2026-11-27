title: The Teacher
id: the-teacher
narrator: bm_george
music: heist
accent: #ff4a3a
tempo: 1.06

cast:
  me: Knight | adult | hair=short:#1a1a1a | top=#1c1d22:jumpsuit | skin=#e8b48f | beard=stubble | voice=bm_daniel
  meM: Knight | adult | hair=short:#1a1a1a | top=#1c1d22:jumpsuit | mask=fox | voice=bm_daniel
  teacher: The Teacher | adult | hair=side:#3a2a1a | glasses | top=#5a4a3a:jacket | top2=#e9e6df | beard=stubble | voice=bm_lewis
  king: King | adult | hair=buzz:#2a2a2a | top=#1c1d22:jumpsuit | build=1.4 | beard=full | skin=#c98e64 | voice=am_adam
  kingM: King | adult | hair=hood:#1c1d22 | top=#1c1d22:jumpsuit | build=1.4 | mask=fox | voice=am_adam
  bishop: Bishop | adult | hair=bun:#c9862e | top=#1c1d22:jumpsuit | glasses | voice=af_nicole
  rook: Rook | adult | hair=messy:#5a3a22 | top=#1c1d22:jumpsuit | beard=moustache | voice=am_michael
  rookM: Rook | adult | hair=hood:#1c1d22 | top=#1c1d22:jumpsuit | mask=fox | voice=am_michael
  pawn: Leon | teen | hair=curly:#2a1a12 | top=#1c1d22:jumpsuit | skin=#9a6440 | voice=am_puck
  pawnM: Leon | teen | hair=hood:#1c1d22 | top=#1c1d22:jumpsuit | mask=fox | voice=am_puck
  sofia: Inspector Reyes | adult | hair=long:#2a1a12 | top=#6a2a2a:coat | top2=#e9e6df | skin=#e8b48f | voice=af_sarah
  clara: Clara | teen | hair=long:#e0c070 | top=#cfe0f0:shirt | voice=af_sky
  guard: Guard | adult | hair=cap:#2a3a5a | top=#2a3a5a:uniform | voice=am_eric
  cop: Officer | adult | hair=cap:#1a2a4a | top=#1a2a4a:uniform | voice=am_eric

scenes:
  city: outside sky=night far=city ground=asphalt | streetlamp .15 | streetlamp .85 | car .5 c=#7a7f88
  hideout: room wall=#5a5048:brick floor=#3a3632:concrete light=warm | board .5 | table .5 y=120 | lamp .12 | lamp .88
  mint: room wall=#cfc6b0:stone floor=#8a7a62:check light=warm | printer .3 | printer .75 | lamp .5
  mint-money: room wall=#cfc6b0:stone floor=#8a7a62:check light=warm weather=money | printer .3 | printer .75 | cashpile .5 y=120
  lobby: room wall=#d8d0bc:stone floor=#9a8a70:tile light=warm | crowd .5 v=12 y=40 c=#4a4a58 | lamp .1 | lamp .9
  vault: room wall=#4a5058:concrete floor=#2a2e34:plain light=cold | vault .5 | cashpile .2 y=60 | cashpile .82 y=60
  vault-open: room wall=#4a5058:concrete floor=#2a2e34:plain light=cold | vault .5 v=spin | cashpile .2 y=60 | cashpile .82 y=60
  police: outside sky=night far=city ground=asphalt | police .2 | police .72 | streetlamp .5 | fence .5 y=200 c=#c8c8c8
  command: room wall=#22262e:concrete floor=#15181e:plain light=dark | monitors .5 | desk .3 y=80 | desk .75 y=80
  cafe: room wall=#c9a27a:stripes floor=#6a4a2a:wood light=warm | window .5 v=curtain:#7a2a24 | table .5 | lamp .12 | lamp .88
  tunnel: room wall=#4a3e34:stone floor=#2a221c:plain light=dark | lamp .2 | lamp .8
  roof: outside sky=dusk far=city ground=asphalt weather=money light=dusk | fence .5 y=60 c=#8a8e96
  beach: outside sky=day far=sea ground=sand light=day | tent .2 c=#e0b030 | pine .9 s=.8 c=#3f8a4f
  cell: room wall=#8a8e96:concrete floor=#4a4e56:plain light=cold | bars .5 | bed .3 c=#6a7080
  void: void

== 1
mint | Eight strangers. Eleven days. Two point four ^billion^ euros. And not a single shot fired. | cam=push @kingM:.2:smug:arms+y=100 @meM:.5:determined:idle+y=100 @rookM:.8:grin:idle+y=100
hideout | That was the plan. The Teacher's plan. | @teacher:.5:smile:talk+y=60 cam=push
hideout | He found me in a prison cell. I was nineteen. I'd hacked a bank for fun. | tag=ONE_YEAR_EARLIER @teacher:.35:smile:idle+y=60 @me:.7:suspicious:arms+y=60 cam=creep
hideout | teacher> You don't need a gun to rob a bank. You need *patience.* | close=teacher @teacher:.5:smile:talk
hideout | He gave us chess names. King. Bishop. Rook. Two kids called Pawn. | @king:.2:smug:arms+y=80 @bishop:.4:neutral:idle+y=80 @rook:.6:grin:idle+y=80 @pawn:.79:smile:idle+y=80 cam=push
hideout | And me. ^Knight.^ | close=me @me:.5:determined:idle cam=zoom
hideout | teacher> We're not stealing anybody's money. We're going to ^print our own.^ | close=teacher @teacher:.5:smug:talk cam=push
city | The National Mint. Every euro in the country comes out of that building. | cam=up
city | We'd lock ourselves inside. Print money for eleven days. And the police would watch. | cam=push
hideout | teacher> Three rules. No names. No relationships. No blood. | close=teacher rule=THREE_RULES @teacher:.5:determined:talk
city | Five months later, a truck drove through the gates of the Mint. | t=flash tag=DAY_1_-_9:14_AM cam=push @kingM:.3:determined:idle+y=120 @meM:.5:determined:idle+y=120 @rookM:.7:determined:idle+y=120
lobby | We came out in black suits and ^white fox masks.^ | @meM:.3:blank:fists+y=150+size=1.1 @kingM:.7:blank:arms+y=150+size=1.1 cam=push sfx=slam
lobby | Sixty-seven hostages. Not one of them got hurt. | cam=right sfx=crowd
police | Eleven minutes later, the whole city was outside. | cam=pull sfx=siren
command | The police sent their best. Inspector Sofia Reyes. Fourteen years. Never lost a hostage. | @sofia:.5:determined:arms+y=60 cam=push
command | And the phone in the Mint started to ring. | sfx=buzz cam=zoom
command | | prop=phone:call:The_Teacher:connected hold=1.4
command | teacher> Good morning, Inspector. Please don't come in. We're going to be here a while. | close=sofia @sofia:.5:suspicious:phone+item=phone cam=push
lobby | Everything was perfect. Until Rook counted the hostages again. | @rookM:.5:blank:point+y=100 cam=creep
lobby | Sixty-eight. One more than the list. | cam=zoom sfx=sub
lobby | A blonde girl in the back row. Seventeen. Hiding her face. | close=clara @clara:.5:scared:idle
lobby | She wasn't an employee. She was the daughter of ^the British ambassador.^ | close=clara @clara:.5:terrified:idle cam=zoom
lobby | And she'd seen my face before I put on the mask. | close=me @me:.5:shocked:idle sfx=stinger cam=shake

== 2
lobby | The most important hostage in the country. And she knew my face. | close=me @me:.5:worried:idle t=black cam=push
lobby | King wanted to lock her in the basement. | @kingM:.4:blank:point+y=120 @meM:.7:blank:idle+y=120 cam=push
lobby | I said no. I took her a bottle of water instead. | @me:.4:sad:hold+cup+y=100 @clara:.7:scared:idle+y=100 cam=creep
lobby | clara> [whispering] You're the one from the tram. You're scared too. I can tell. | close=clara @clara:.5:worried:talk
lobby | Nobody had ever noticed that about me before. | close=me @me:.5:sad:idle
mint | Down in the basement, the printers started up. *Day 1.* Ten million an hour. | cam=right tag=DAY_1 sfx=tick
mint-money | The sound of money being born. | cam=push
command | Outside, Inspector Reyes was going over everything. Cars. Phones. Floor plans. | @sofia:.5:determined:write+y=60 cam=creep
command | sofia> Who rents a warehouse for five months and never turns on the lights? | close=sofia @sofia:.5:suspicious:talk
command | She was smart. Too smart. And she was ^on our trail.^ | close=sofia @sofia:.5:determined:idle cam=zoom
lobby | Day two. A hostage stood up. Then five more. They rushed King. | tag=DAY_2 cam=shake sfx=slam @kingM:.62:shocked:hands-up+y=80 @meM:.3:scared:idle+y=60
lobby | Somebody grabbed his mask and pulled it off. | @king:.5:angry:fists+y=120+size=1.1 t=flash cam=push
lobby | Every camera in the building saw his face. And outside, the news was ^live.^ | fx=cctv cam=zoom
void | | prop=news:WHO_IS_THIS_MAN?:CITY_DAILY:Robber_unmasked_inside_the_Mint hold=2.4
hideout | In a café across the city, the Teacher watched it on TV. | cam=push @teacher:.5:worried:idle+y=60
cafe | He didn't panic. He ordered another coffee. | @teacher:.5:neutral:sit+item=cup+y=40 cam=creep
cafe | Then the bell over the door rang. | sfx=bells cam=push
cafe | And Inspector Sofia Reyes walked in. Sat down at the table next to his. | @sofia:.25:sad:walk+to=.32+y=40 @teacher:.72:neutral:sit+item=cup+y=40 cam=left
cafe | sofia> [sigh] Bad day? | close=sofia @sofia:.5:sad:talk
cafe | teacher> [calm] You have no idea. | close=teacher @teacher:.5:smile:talk cam=zoom sfx=stinger

== 3
cafe | The most wanted man in the country... and the woman hunting him. Sharing sugar. | @sofia:.3:smile:sit+y=40 @teacher:.7:smile:sit+item=cup+y=40 t=black cam=push
cafe | He told her his name was Elias. A teacher. Maths. | close=teacher @teacher:.5:smile:talk
cafe | She told him she hadn't slept in two days. | close=sofia @sofia:.5:sad:talk
cafe | And before she left, she wrote her number on a ^napkin.^ | prop=note:Sofia/+34_611_xxx sfx=page
cafe | He should have burned it. He put it in his pocket. | close=teacher @teacher:.5:sad:idle cam=zoom
mint-money | Inside, Day three. Rook was running the printers twenty hours a day. | tag=DAY_3 @rook:.5:grin:idle+y=100 cam=right
mint-money | rook> [laugh] Eight hundred million, Knight! We're rich! | close=rook @rook:.5:grin:talk
tunnel | And under our feet, Pawn and King were digging. Our way out. | @pawn:.35:determined:crouch+y=80 @king:.65:angry:crouch+y=80 cam=push sfx=chains
tunnel | Ninety meters. To an old sewer under a playground. That was the escape. | cam=right
lobby | I kept bringing Clara water. Then food. Then a book. | @me:.4:smile:hold+letter+y=100 @clara:.7:smile:idle+y=100 cam=creep
lobby | clara> [whispering] My dad hasn't called the police once. Not once. Did you know that? | close=clara @clara:.5:sad:talk
lobby | clara> [whispering] He doesn't want me back. He wants the ^headlines.^ | close=clara @clara:.5:crying:talk cam=push
lobby | That night I broke rule number two. I sat with her until she fell asleep. | @me:.4:sad:sit+y=100 @clara:.65:sleep:sit+y=100 cam=creep
command | Outside, the Inspector's team found a coffee cup in the warehouse we'd rented. | @sofia:.5:determined:hold+cup+y=60 cam=push
command | One fingerprint on it. | prop=photo:EVIDENCE_#14 sfx=sub
command | They ran it through the system. Twelve minutes. | prop=clock:00:12:SEARCHING cam=push
command | The name came back. ^Elias Moreno.^ Maths teacher. | close=sofia @sofia:.5:shocked:idle cam=zoom
command | Sofia stared at the screen. Then she reached into her coat pocket... for her phone. | close=sofia @sofia:.5:terrified:phone+item=phone cam=push
command | Last call. An unknown number. The man from the café. | prop=phone:call:Elias:last_call:_yesterday sfx=stinger

== 4
command | She knew. And she didn't tell anyone. | close=sofia @sofia:.5:sad:idle t=black cam=push
cafe | Instead she called him. She asked him to meet her. Same café. Same table. | prop=phone:call:Elias:calling...
cafe | And the Teacher said yes. Because he was in love with her. And that was ^rule two.^ | close=teacher @teacher:.5:sad:phone+item=phone cam=zoom
lobby | Inside, I didn't know any of this. Day five. Everything was going wrong. | tag=DAY_5 cam=push @meM:.5:worried:idle+y=60
lobby | The hostages were fighting. King was shouting. The printers jammed twice. | cam=shake sfx=alarm @kingM:.35:angry:point+y=60 @meM:.68:worried:idle+y=60
tunnel | And then the tunnel flooded. | @pawn:.5:terrified:hands-up+y=100 fx=rain cam=shake sfx=gust
tunnel | Pawn got out. Barely. Our escape was ^under water.^ | close=pawn @pawn:.5:terrified:idle cam=zoom
lobby | We called the Teacher on the red line. He always picked up on the first ring. | prop=phone:call:The_Teacher:calling...
lobby | Ring. Ring. Ring. | sfx=buzz cam=push
lobby | He didn't pick up. | close=me @me:.5:worried:phone+item=phone cam=zoom
cafe | Because at that moment, he was sitting across from Sofia. | @sofia:.3:sad:sit+y=40 @teacher:.7:smile:sit+item=cup+y=40 cam=creep
cafe | sofia> [sad] I liked you, Elias. I really did. | close=sofia @sofia:.5:sad:talk
cafe | Then two men at the next table stood up. Police. | @cop:.15:angry:walk+to=.4+y=40 @cop:.88:angry:walk+to=.65+y=40 cam=push sfx=steps
cafe | They put him in handcuffs in front of everyone. | @teacher:.5:sad:hands-up+y=40 cam=zoom
lobby | Inside, every TV in the lobby showed the same thing. | cam=push @meM:.4:shocked:idle+y=60 @clara:.68:scared:idle+y=60
void | | prop=news:TEACHER_ARRESTED:CITY_DAILY:Heist_mastermind_caught_in_café hold=2.4 sfx=stinger
lobby | The plan was dead. Our leader was gone. And six robbers turned to look at ^me.^ | close=me @me:.5:terrified:idle cam=zoom

== 5
lobby | Rule one of the plan: if the Teacher falls... ^Knight^ takes over. | close=me rule=PLAN_B @me:.5:scared:idle t=black cam=push
lobby | I was nineteen. I'd never been in charge of anything except a laptop. | close=me @me:.5:worried:idle
mint | King laughed at me. Rook wanted to run. The twins wanted to surrender. | @king:.2:angry:point+y=100 @rook:.5:scared:idle+y=100 @pawn:.8:crying:idle+y=100 cam=right
mint | And then Clara walked into the basement. She'd followed me. | @clara:.5:determined:walk+to=.5+y=150 cam=push
mint | clara> [calm] You want to get out? Use me. I'm the most valuable thing in this building. | close=clara @clara:.5:determined:talk
mint | clara> Tell them the ambassador's daughter wants to ^speak to the world.^ | close=clara @clara:.5:determined:talk cam=zoom
lobby | So we put her on camera. Live. Every channel in Europe. | fx=cctv cam=push @clara:.5:determined:talk+y=60
lobby | clara> My name is Clara. Nobody here has hurt me. And my father hasn't called. Not once. | close=clara @clara:.5:sad:talk
lobby | clara> [crying] Ask him why. | close=clara @clara:.5:crying:talk cam=zoom
police | Outside, the crowd went silent. Then they started to ^cheer.^ For us. | cam=pull sfx=crowd
void | | prop=news:"ASK_HIM_WHY":CITY_DAILY:Hostage_speaks_out hold=2.2
command | And in a holding cell downtown, Inspector Reyes visited the Teacher. | tag=POLICE_HQ cam=push @sofia:.35:sad:idle+y=60 @teacher:.68:smile:idle+y=60
cell | sofia> [cold] You used me. | @sofia:.3:angry:arms+y=60 @teacher:.7:sad:sit+y=60 cam=creep
cell | teacher> [calm] No. I fell for you. That was never part of the plan. | close=teacher @teacher:.5:sad:talk
cell | teacher> But this is. Look at your watch, Sofia. | close=teacher @teacher:.5:smile:talk cam=push
cell | It was exactly *4:00 PM.* | prop=clock:16:00 sfx=tick
cell | And every light in police headquarters ^went out.^ | fx=blackout t=flash sfx=sub cam=shake

== 6
cell | Blackout. The whole building. Every door unlocked at once. | fx=blackout t=black cam=shake
cell | The Teacher planned his own arrest. Down to the minute. | close=teacher @teacher:.5:smug:idle fx=dark cam=push
cell | He walked out of the cell. Past the Inspector. And stopped. | @teacher:.4:sad:walk+to=.6+y=60 @sofia:.75:shocked:idle+y=60 fx=dark cam=right
cell | teacher> [whispering] Come with me. | close=teacher @teacher:.5:sad:talk fx=dark
cell | She didn't. And he left without her. | close=sofia @sofia:.5:crying:idle fx=dark cam=zoom
mint | Day seven. The red phone rang in the Mint. First ring. | tag=DAY_7 prop=phone:call:The_Teacher:connected sfx=buzz
mint | teacher> Knight. You kept them alive. I'm proud of you. Now listen very carefully. | close=me @me:.5:relief:phone+item=phone cam=push
mint | teacher> The tunnel is gone. So we're leaving the way nobody would ever expect. | close=me @me:.5:shocked:phone+item=phone
mint | teacher> Through the ^front door.^ | close=me @me:.5:shocked:phone+item=phone cam=zoom sfx=sub
mint-money | But first we had to finish the print. Three days. Two billion more. | cam=right
lobby | That night, I found Pawn at the window. On a phone I'd never seen. | @pawnM:.6:scared:phone+item=phone+y=100 cam=push fx=dark
lobby | He was whispering. To the ^police.^ | close=pawn @pawn:.5:terrified:phone+item=phone cam=zoom fx=dark
lobby | pawn> [crying] They have my mum. They said they'd let her go if I gave them the plan. | close=pawn @pawn:.5:crying:talk fx=dark
lobby | A traitor. Sixteen years old. Crying into a phone. | close=me @me:.5:sad:idle fx=dark cam=push
lobby | And he'd already told them everything. The front door. The time. ^Day ten. Noon.^ | close=pawn @pawn:.5:crying:idle fx=dark cam=zoom sfx=stinger

== 7
lobby | The police knew our exit. Our time. Our plan. | close=me @me:.5:terrified:idle t=black cam=push
lobby | King wanted to throw Pawn out of the window. | @kingM:.3:angry:point+y=100 @pawnM:.7:terrified:hands-up+y=100 cam=shake
lobby | I stood between them. Rule three. ^No blood.^ | @me:.5:determined:hands-up+y=100+size=1.1 cam=push rule=RULE_#3
mint | Then I called the Teacher. | prop=phone:call:The_Teacher:connected
mint | teacher> [calm] Good. Let them think they know the plan. | close=me @me:.5:shocked:phone+item=phone
mint | teacher> Pawn just gave them the perfect ^lie.^ He doesn't know it. But he just saved you. | close=me @me:.5:shocked:phone+item=phone cam=zoom
vault | Day nine. We cracked the vault for the first time. Not to steal. To hide something. | tag=DAY_9 cam=push
vault-open | Inside the vault, behind the gold, was a small grey door. | cam=zoom sfx=creak
vault-open | The Teacher's real plan. Built into the Mint in 1974. By an architect. His father. | cam=push
vault-open | A second tunnel. Dry. Secret. Never on any map. | prop=map:PARK_GATE:THE_MINT hold=2.4
lobby | But one of us had to stay behind. Somebody had to keep the police looking at the front door. | close=me @me:.5:sad:idle cam=creep
lobby | King stood up. | @king:.5:determined:idle+y=120+size=1.15 cam=push
lobby | king> [calm] I'm forty-six. I've been running my whole life. Let me ^stop somewhere useful.^ | close=king @king:.5:sad:talk
lobby | Nobody argued. Nobody could. | close=me @me:.5:crying:idle cam=zoom
lobby | Day ten. Eleven fifty-nine. The police were ready at the front door. | tag=DAY_10_-_11:59 prop=clock:11:59 sfx=tick
lobby | And then King opened it. Alone. | @kingM:.5:determined:walk+to=.5+y=150+size=1.1 t=flash cam=push sfx=door

== 8
roof | King didn't walk out with his hands up. He walked out with a ^leaf blower.^ | @kingM:.5:grin:hold+y=120 t=black cam=up
roof | Filled with money. Freshly printed. | cam=push fx=money
roof | He turned it on. And two million euros flew over the crowd. | fx=money cam=zoom sfx=gust
police | People screamed. Then they ran. Not away from the Mint. ^Towards^ it. | fx=money cam=shake sfx=crowd
police | Ten thousand people grabbing money out of the air. The police couldn't move. | fx=money cam=right
tunnel | And under all of them, we were running. | @meM:.3:determined:run+to=.7+y=80 @rookM:.15:scared:run+to=.55+y=80 fx=dark cam=right
tunnel | Rook. Bishop. Pawn. Clara. And me. | @pawnM:.2:scared:run+to=.6+y=100 @clara:.4:scared:run+to=.8+y=100 fx=dark cam=right
tunnel | Wait. ^Clara?^ | close=clara @clara:.5:determined:idle fx=dark cam=zoom
tunnel | clara> I'm not going back to him. Hostages can choose too, you know. | close=clara @clara:.5:smile:talk fx=dark
tunnel | Two kilometers. Through the dark. Holding hands. | @me:.4:smile:walk+to=.6+y=100 @clara:.6:smile:walk+to=.8+y=100 fx=dark cam=right
tunnel | Then the tunnel ended in a door. A small blue door. | cam=push fx=dark
city | It opened into the back of a bakery in the old town. | cam=up
city | The Teacher was waiting. In an apron. With a van full of flour. | @teacher:.5:smile:idle+y=100 cam=push
city | teacher> [laugh] Welcome to the bakery business, Knight. | close=teacher @teacher:.5:grin:talk
city | And behind him, getting out of an unmarked police car... | cam=zoom sfx=door
city | Inspector Sofia Reyes. ^Alone.^ | @sofia:.5:blank:idle+y=100+size=1.1 cam=push sfx=stinger

== 9
city | Inspector Reyes. With a gun in her hand. Pointed at the Teacher. | @sofia:.3:angry:point+y=100 @teacher:.72:sad:hands-up+y=100 t=black cam=push
city | sofia> [angry] I had a career, Elias. A life. You took it on a napkin. | close=sofia @sofia:.5:angry:talk
city | teacher> [calm] Then take mine. I won't run from you. | close=teacher @teacher:.5:sad:talk cam=zoom
city | We were all frozen. Rook. Bishop. Pawn. Clara behind me. | cam=right
city | And then Pawn stepped in front of the Teacher. | @pawn:.5:crying:hands-up+y=120+size=1.1 cam=push
city | pawn> [crying] I'm the traitor. I called you. Arrest ^me.^ Let them go. | close=pawn @pawn:.5:crying:talk
city | sofia> [quiet] Your mother. They told you she was in custody. | close=sofia @sofia:.5:sad:talk
city | sofia> They lied to you, kid. They lied to me too. She was never arrested. | close=sofia @sofia:.5:sad:talk cam=zoom
city | Sofia lowered the gun. | close=sofia @sofia:.5:sad:idle cam=pull
city | sofia> [sigh] My bosses used a sixteen-year-old. And they called *you* the criminals. | close=sofia @sofia:.5:angry:talk
city | She threw her police badge into the flour van. | prop=photo:BADGE_#4471 sfx=click
city | sofia> Is there room for one more? | close=sofia @sofia:.5:smile:talk cam=push
city | The Teacher smiled. The first real smile I'd ever seen on him. | close=teacher @teacher:.5:smile:idle
city | And then sirens. Twenty of them. Coming from both ends of the street. | sfx=siren cam=shake fx=shake
city | Someone else had followed Sofia. Someone she'd ^trusted.^ | close=sofia @sofia:.5:terrified:idle cam=zoom sfx=stinger

== 10
city | Twenty police cars. One flour van. Seven of us. | t=black cam=up sfx=siren
city | The Teacher looked at his watch. Like always. | close=teacher @teacher:.5:smile:idle
city | teacher> [calm] Knight. Remember what I said in the warehouse? | close=teacher @teacher:.5:smile:talk
city | You don't need a gun to rob a bank. You need *patience.* | close=me @me:.5:determined:idle cam=push
city | At exactly 12:47, every bakery van in the old town started its engine. | prop=clock:12:47 sfx=tick
city | Forty-two white vans. Same company. Same logo. Driving out in forty-two different directions. | cam=right
police | The police followed all forty-two. We were in the forty-third. | fx=money cam=pull
beach | Six weeks later. An island I can't name. | tag=SIX_WEEKS_LATER cam=push
beach | Rook bought a boat. Bishop opened a bookshop. Pawn's mum moved in with him. | @rook:.24:grin:wave+y=100 @bishop:.5:smile:idle+y=100 @pawn:.74:smile:idle+y=100 cam=push
beach | The Teacher and Sofia drink coffee every morning. Same table. | @teacher:.35:smile:sit+item=cup+y=60 @sofia:.65:smile:sit+item=cup+y=60 cam=creep
beach | And Clara? She's learning to hack. From me. | @clara:.35:smile:idle+y=100 @me:.65:smile:idle+y=100 cam=push
beach | King took twelve years in prison. We visit him in March. He says the food is great. | close=me @me:.5:sad:idle
beach | Last night, the Teacher put a newspaper on my table. | @teacher:.5:smile:idle+y=100 cam=push
void | | prop=news:CENTRAL_GOLD_RESERVE:THE_NORTHERN_POST:200_tonnes_moved_to_new_vault hold=2.4
beach | teacher> [calm] Two hundred tonnes of gold. One vault. No windows. | close=teacher @teacher:.5:smug:talk
beach | teacher> Interested, Knight? | close=teacher @teacher:.5:smile:talk cam=zoom sfx=stinger
