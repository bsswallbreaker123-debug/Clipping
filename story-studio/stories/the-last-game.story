title: The Last Game
id: the-last-game
narrator: bm_george
music: tension
accent: #ff3b6b
tempo: 1.07

cast:
  me: Kai | adult | hair=messy:#1a1a1a | top=#8a929c:jumpsuit | badge=218 | skin=#e8b48f
  noah: Noah | teen | hair=short:#1a1a1a | top=#8a929c:jumpsuit | badge=002 | skin=#e8b48f | voice=am_puck+2
  rina: Rina | adult | hair=ponytail:#2a1a12 | top=#8a929c:jumpsuit | badge=144 | skin=#f2c9a8 | voice=af_nicole
  abbott: Mr. Abbott | old | hair=bald:#d8d4cc | top=#8a929c:jumpsuit | badge=009 | wrinkles | glasses | voice=bm_lewis
  brick: Brick | adult | hair=buzz:#3a2414 | top=#8a929c:jumpsuit | badge=301 | build=1.35 | beard=stubble | skin=#c98e64 | voice=am_adam
  guard: Guard | adult | hair=hood | top2=#8a1c22 | top=#b3262e:jumpsuit | mask=visor | voice=am_fenrir+-2
  dad: Guard 17 | adult | hair=hood | top2=#8a1c22 | top=#b3262e:jumpsuit | mask=visor | voice=am_michael
  dadface: Dad | adult | hair=short:#2a2a2a | top=#b3262e:jumpsuit | beard=stubble | skin=#e8b48f | voice=am_michael
  host: The Host | adult | hair=hood | top2=#111 | top=#1a1a1a:coat | mask=doll | voice=bm_daniel+-3
  mum: Mum | adult | hair=bob:#2a1a12 | top=#cfe0e8:shirt | skin=#e8b48f | voice=af_sarah
  suit: The Man in the Suit | adult | hair=side:#1a1a1a | top=#22252c:suit | top2=#f1f1f1 | voice=bm_george
  vip: Guest | adult | hair=side:#2a2a2a | top=#2a2a30:suit | top2=#f1f1f1 | mask=gold | voice=bm_lewis

scenes:
  street: outside sky=night far=city ground=asphalt | streetlamp .2 | car .78 c=#7a7f88
  hospital: room wall=#cfe0e0:tile floor=#9aa8a8:tile light=cold | bed .45 c=#9ab0c8 | window .82 | tv .82 v=off y=-300
  subway: room wall=#cfc8a8:tile floor=#5a5a60:plain light=cold | lamp .15 | lamp .85 | sign .5 v=LINE_4 y=-200
  dorm: room wall=#d8d8d0:tile floor=#6a7080:plain light=cold floorY=1420 | bunk .12 | bunk .5 | bunk .88 | crowd .5 v=10 y=180 c=#6a7078
  dorm-night: room wall=#d8d8d0:tile floor=#6a7080:plain light=dark floorY=1420 | bunk .12 | bunk .5 | bunk .88
  arena: outside sky=day far=hills ground=sand light=day | statue .5 s=.5 y=-330 | line .5 y=-60 c=#d62828 | crowd .5 v=16 y=260 c=#7a828c
  arena-look: outside sky=day far=hills ground=sand light=day | statue .5 s=.5 y=-330 v=look | line .5 y=-60 c=#d62828 | crowd .5 v=16 y=260 c=#7a828c
  arena-turn: outside sky=day far=hills ground=sand light=day | statue .5 s=.5 y=-330 v=turn | line .5 y=-60 c=#d62828 | crowd .5 v=12 y=260 c=#7a828c
  stairs: room wall=#e87aa8:plain floor=#5ab0c0:tile light=day | stairs .3 c=#f0c040 | stairs .75 c=#5ab0c0 s=.8 flip
  control: room wall=#15181e:concrete floor=#0c0d10:plain light=dark | monitors .5 s=1.1 | desk .5 y=60
  chairs: room wall=#101016:concrete floor=#06060a:plain light=dark floorY=1250 | chairs .5 v=7
  chairs-few: room wall=#101016:concrete floor=#06060a:plain light=dark floorY=1250 | chairs .5 v=2
  bridge: room wall=#06060a:plain floor=#040407:plain light=cold floorY=1350 | tiles .5
  bridge-broken: room wall=#06060a:plain floor=#040407:plain light=cold floorY=1350 | tiles .5 v=3,4,7,10
  vip: room wall=#3a1a1a:stripes floor=#2a1a1a:wood light=warm | sofa .25 c=#6a1a1a | sofa .78 c=#6a1a1a | lamp .5 | monitors .5 s=.7 y=-200
  bathroom: room wall=#e0e4e8:tile floor=#8a929c:tile light=cold | sink .3 | mirror .3 | sink .72
  rain: outside sky=storm far=hills ground=sand weather=rain light=dark | line .5 y=-60 c=#d62828
  void: void

== 1
void | One hundred strangers. Six children's games. One winner takes *everything.* | t=black cam=push
hospital | Three weeks ago, my mum's hospital bill hit *four hundred and twelve thousand* dollars. | @mum:.45:sleep:lie+y=-205+size=.85 @me:.82:sad:idle+y=60 cam=creep
subway | Then a man in a suit sat down next to me on the subway. | @suit:.3:smile:idle+y=60 @me:.7:suspicious:idle+y=60 cam=push
subway | suit> Do you want to play a game, Kai? | close=suit @suit:.5:smile:talk
subway | He handed me a gold card. One side said ^PLAY.^ The other had a phone number. | prop=ticket:PLAY:CALL_0800-0000:#c9a23a sfx=page
street | I called it that night. A van picked me up. Somebody pressed a cloth to my face. | @me:.3:scared:idle+y=80 cam=shake t=flash
dorm | I woke up in a room with ninety-nine other people. All in the same grey tracksuit. | cam=push t=black
dorm | Mine said *218.* | close=me @me:.5:shocked:idle cam=zoom
dorm | Then the guards walked in. Red suits. Black masks with one glowing ^red line.^ | @guard:.3:blank:arms+y=40 @guard:.7:blank:arms+y=40 cam=push sfx=steps
dorm | guard> Game one starts in ten minutes. Win, and the money is yours. | close=guard @guard:.5:blank:talk
arena | They led us outside into a giant field. And at the end of it... | cam=up
arena | A giant wooden *owl.* Fifty feet tall. With its back to us. | cam=zoom
arena | guard> When the owl sings, you move. When the owl looks... ^you freeze.^ | close=guard rule=RULE_#1 @guard:.5:blank:talk
arena | Some people laughed. Owl Light. A game for six-year-olds. | @brick:.3:grin:arms+y=180 @me:.7:neutral:idle+y=180 cam=creep
arena-turn | The owl started to sing. Everyone ran. | @me:.3:determined:run+to=.6+y=200 @brick:.7:grin:run+to=.85+y=160 cam=right
arena-look | Then its head turned. *All* the way around. | cam=zoom sfx=creak
arena-look | A guy next to me was still running when it looked. | @brick:.5:terrified:run+y=160 cam=push
arena-look | The sand under his feet just... ^opened.^ And he was gone. | cam=shake t=flash sfx=sub
arena-look | Nobody laughed after that. | @me:.5:terrified:idle+y=200+size=1.2 cam=push
arena-turn | Every time it sang, we ran. Every time it looked, someone else ^dropped.^ | cam=right sfx=sub
arena | I crossed the red line with *two seconds* left. | @me:.5:relief:run+y=120+size=1.1 cam=push
void | | prop=number:58:100:PLAYERS_LEFT hold=2.2 sfx=stinger
dorm | Fifty-eight left. Above us, a glass piggy bank started filling with *cash.* | cam=up
dorm | Then I saw a kid sitting alone on the top bunk. Fifteen. Shaking. | @noah:.5:scared:sit+y=-250+size=.9 cam=push
dorm | His tracksuit said *002.* | close=noah @noah:.5:scared:idle cam=zoom
dorm | And his face... was my little ^brother's.^ | close=noah,me @noah:.5:crying:idle @me:.5:shocked:idle cam=push sfx=stinger

== 2
dorm | My fifteen-year-old brother Noah was supposed to be at home. Doing homework. | close=noah,me @noah:.5:crying:idle @me:.5:angry:idle cam=push t=black
dorm | noah> [crying] The man said I could pay for Mum's surgery. I didn't know you'd be here. | close=noah @noah:.5:crying:talk
dorm | And then the speakers crackled. | sfx=buzz cam=up
dorm | host> [calm] Rule three. If the majority votes to stop, the games end. Everyone goes home. ^With nothing.^ | rule=RULE_#3 cam=push
dorm | Fifty-eight people. One button each. Green to stay. Red to go home. | cam=creep
dorm | I pressed red. For Noah. I didn't care about the money anymore. | close=me @me:.5:determined:idle
void | | prop=number:29:0:STAY hold=1.6
void | | prop=number:28:0:LEAVE hold=1.6
dorm | Twenty-nine to stay. Twenty-eight to leave. One vote left. | cam=push
dorm | Number 002. | close=noah @noah:.5:scared:idle cam=zoom
dorm | He looked at me. And he pressed ^green.^ | close=noah @noah:.5:crying:idle sfx=stinger cam=shake
dorm | noah> [crying] Mum dies either way, Kai. At least this way we have a chance. | close=noah @noah:.5:crying:talk
dorm-night | That night, the lights went out at eleven. | fx=dark cam=creep tag=NIGHT_1
dorm-night | And at eleven-oh-five, the first fight started. | fx=dark,shake sfx=slam cam=shake
dorm-night | Fewer players. Bigger prize. Some people did the math ^fast.^ | @brick:.5:angry:fists+y=120+size=1.1 fx=dark cam=push
dorm-night | Brick. Number 301. He went for Noah first. | @brick:.65:angry:reach+y=80 @noah:.3:terrified:hide+y=80 fx=dark cam=right
dorm-night | Somebody pulled him off. An old man. Number *009.* | @abbott:.45:determined:hold+y=80 @brick:.75:angry:fists+y=80 fx=dark
dorm-night | abbott> [calm] Children's games, son. Let's not forget whose game this is. | close=abbott @abbott:.5:smile:talk
bathroom | At three in the morning, I went to the bathroom to splash my face. | @me:.72:sad:idle+y=60 cam=creep
bathroom | A guard was standing at the sink. Alone. With his mask *off.* | @dadface:.3:sad:idle+y=60+look=down @me:.72:shocked:idle+y=60 cam=push
bathroom | He looked up at me in the mirror. | close=dadface @dadface:.5:shocked:idle cam=zoom
bathroom | It was my dad. Who walked out on us ^three years ago.^ | close=dadface,me @dadface:.5:shocked:idle @me:.5:terrified:idle cam=shake sfx=stinger

== 3
bathroom | My dad. In a red suit. Working for the people who were killing us. | close=dadface,me @dadface:.5:sad:idle @me:.5:angry:idle t=black cam=push
bathroom | dadface> [whispering] Kai. Put your head down. Don't look at me. They watch the cameras. | close=dadface @dadface:.5:scared:talk
bathroom | Then he pulled his mask back on and walked out. Like I was nobody. | @dad:.3:blank:walk+to=-.2+y=60 @me:.72:sad:idle+y=60 cam=left sfx=door
stairs | Game two. They walked us up a staircase painted like a kids' playground. | @me:.4:scared:walk+to=.55+y=80 @noah:.6:scared:walk+to=.7+y=80 cam=up
chairs | Into a pitch black room. With a *pit* in the middle. | cam=push fx=dark
chairs | Platforms over the drop. On each one... a single ^chair.^ | cam=down
chairs | host> Musical chairs. Fifty-two players. Seven chairs. Each round, the floor drops. | rule=RULE_#2 cam=zoom
chairs | Fifty-two people. Seven chairs. The music started. | sfx=bells cam=right
chairs | We ran in circles around the edge. Brick shoved a woman off the side. I didn't even hear her land. | @brick:.4:angry:run+to=.7+y=60 @me:.8:scared:run+to=.6+y=100 cam=shake sfx=sub
chairs | The music stopped. I dove. | t=flash sfx=slam cam=shake
chairs | I got a chair. So did Rina. Number 144. And Mr. Abbott. | @me:.25:relief:sit+y=-10 @rina:.55:determined:sit+y=-10 @abbott:.82:smile:sit+y=-10 cam=push
chairs | Noah didn't. | cam=zoom sfx=heartbeat
chairs | He was standing at the edge. Nowhere to sit. The floor behind him started to ^tilt.^ | @noah:.5:terrified:idle+y=160+size=1.1 cam=push fx=shake
chairs | And I did something stupid. I stood up. | close=me @me:.5:determined:idle
chairs | I grabbed his hand and pulled him onto my chair. | @me:.4:determined:reach+y=100 @noah:.6:terrified:reach+y=100 cam=push
chairs-few | The room went silent. Two people. One chair. | cam=zoom fx=dark
chairs-few | host> [calm] Interesting. 218 gave his seat away. That's ^against the rules.^ | cam=push
chairs-few | host> So 218 picks who falls instead. Him. Or someone else. You have ten seconds. | rule=10_SECONDS cam=shake
chairs-few | And every person in that room... turned to look at me. | close=me @me:.5:terrified:idle cam=zoom sfx=stinger

== 4
chairs-few | Ten seconds. Pick who falls. Noah. Me. Or a stranger. | close=me @me:.5:terrified:idle t=black cam=push
chairs-few | Rina stood up from her chair. | @rina:.5:determined:idle+y=120 cam=push
chairs-few | rina> [calm] He doesn't have to pick. I'll go. | close=rina @rina:.5:determined:talk
chairs-few | Then a red suit stepped out of the dark. Guard 17. | @dad:.5:blank:walk+to=.5+y=60 cam=push sfx=steps
chairs-few | dad> Sir. The floor's jammed. Mechanical fault. Round void. | close=dad @dad:.5:blank:talk
chairs-few | A long silence. Then the speaker clicked off. ^We all lived.^ | cam=pull sfx=click
dorm-night | That night, Guard 17 dragged me out of bed for a "random search". | @dad:.3:blank:reach+y=60 @me:.7:scared:idle+y=60 fx=dark tag=NIGHT_2
control | He took me into a room full of screens. And took his mask off. | @dadface:.4:sad:idle+y=60 @me:.72:angry:arms+y=60 cam=push
control | dadface> [sad] Three years ago, I owed people money. Bad people. They gave me a gold card. | close=dadface @dadface:.5:sad:talk
control | dadface> I lost the third game. I thought I'd die. | close=dadface @dadface:.5:sad:talk cam=push
control | dadface> [whispering] But nobody dies here, Kai. The losers fall into a net. Then they get a choice. | close=dadface @dadface:.5:scared:talk cam=zoom
control | dadface> [whispering] Wear the red suit. Or ^disappear for real.^ | close=dadface @dadface:.5:scared:talk sfx=sub
control | Every guard in this place... is a player who lost. | cam=pull
control | I wanted to scream at him. Three years. Mum cried every night. | close=me @me:.5:crying:idle
control | dadface> I'm getting you both out. Tomorrow, after game three. There's a laundry chute— | close=dadface @dadface:.5:determined:talk
control | Then every screen in the room changed at once. | cam=zoom sfx=glitch fx=flicker
control | It was the two of us. Live. From a camera in the ceiling. | fx=cctv cam=push
control | And underneath, a message typed itself. | fx=cctv
control | | prop=phone:chat:THE_HOST:I_see_you,_Guard_17./Game_three_is_yours_now. hold=2.6 sfx=stinger

== 5
dorm | Game three. The speakers said: "Find a partner." | t=black cam=push sfx=buzz
dorm | Everyone grabbed someone. Noah grabbed Rina. Before I could reach them. | @noah:.3:scared:hug+y=100 @rina:.45:determined:idle+y=100 @me:.8:shocked:reach+y=100 cam=right
dorm | That left me. And an old man who smiled like he knew the ending. Number 009. | @abbott:.4:smile:idle+y=100 @me:.7:worried:idle+y=100 cam=push
dorm | abbott> [chuckle] Don't look so sad, son. I'm a very good partner. | close=abbott @abbott:.5:smile:talk
stairs | They took each pair into a little alley. Like the street I grew up on. | cam=up
stairs | host> Each of you gets ten marbles. Win all of your partner's marbles. ^One of you walks out.^ | rule=RULE_#3 cam=push
stairs | It wasn't a game. It was a goodbye. | close=me @me:.5:sad:idle cam=zoom
stairs | Mr. Abbott kept losing. On purpose. I could tell. | @abbott:.3:smile:sit+y=60 @me:.7:sad:sit+y=60 cam=creep
stairs | abbott> [calm] Odd or even, son? | close=abbott @abbott:.5:smile:talk
stairs | I guessed wrong. He told me I was right. | close=me @me:.5:shocked:idle cam=push
stairs | abbott> [calm] Your father is a good man, Kai. He just played the wrong game. | close=abbott @abbott:.5:smile:talk cam=zoom
stairs | How did he know about my dad? | close=me @me:.5:suspicious:idle sfx=sub
stairs | Before I could ask, he put his last marble in my hand. | prop=number:10:0:MARBLES hold=1.8
stairs | abbott> [chuckle] See you upstairs. | close=abbott @abbott:.5:grin:talk cam=push
stairs | Two guards took him away. He was still smiling. | @guard:.3:blank:walk+to=.1 @abbott:.5:smile:walk+to=.25 @guard:.7:blank:walk+to=.42 cam=left
dorm | Back in the dorm, Noah and Rina were both alive. Rina had let Noah win. | @noah:.4:crying:hug+y=100 @me:.6:relief:hug+y=100 cam=push
dorm | But one bunk was empty. ^Guard 17's^ post by the door. | cam=zoom
dorm | The next morning, his red suit was hanging on a hook in the middle of the room. | cam=push sfx=stinger
dorm | With a ^net^ tag pinned to the chest. | close=me @me:.5:terrified:cover cam=zoom

== 6
dorm | A net tag. It meant my dad had fallen. Or been pushed. | close=me @me:.5:terrified:idle t=black cam=push
dorm | Nineteen players left. The piggy bank above us was nearly *full.* | cam=up
void | | prop=number:19:52:PLAYERS_LEFT hold=1.8
bridge | Game four. A glass bridge over a drop so deep I couldn't see the bottom. | cam=down
bridge | host> Two panels per step. One is strong glass. One ^breaks.^ | rule=RULE_#4 cam=push
bridge | And you had to pick a number. That was your place in line. | cam=zoom
bridge | Noah pulled number ^one.^ | close=noah @noah:.5:terrified:idle cam=push sfx=sub
bridge | I pulled sixteen. I'd be the last to go. Watching him guess every step. | close=me @me:.5:terrified:idle
bridge | Noah stood on the edge. Left or right. | @noah:.5:scared:idle+y=120 cam=push
bridge | Left. It held. | sfx=glass cam=shake
bridge | Right. It held. | sfx=glass
bridge | Left. | cam=zoom sfx=heartbeat
bridge-broken | ^It broke.^ | t=flash sfx=glass cam=shake
bridge-broken | Noah grabbed the metal frame with one hand. Dangling over nothing. | @noah:.5:terrified:hands-up+y=330 cam=push fx=shake
bridge-broken | Behind him, Brick stepped onto the next panel. | @brick:.62:grin:idle+y=-40+size=.85 cam=zoom
bridge-broken | He could have pulled him up. Instead, he looked at the number on Noah's back. | close=brick @brick:.5:smug:idle cam=push
bridge-broken | brick> [sarcastic] Fewer players... bigger prize, kid. | close=brick @brick:.5:grin:talk
bridge-broken | And he stepped on Noah's ^fingers.^ | t=flash sfx=stinger cam=shake

== 7
bridge-broken | I screamed his name so loud my throat bled. | close=me @me:.5:crying:idle t=black cam=shake
bridge-broken | Noah fell. Into the dark. | cam=down sfx=gust
bridge-broken | And then a red suit dove off the side of the bridge. After him. | @dad:.5:determined:reach+y=260 cam=down sfx=whoosh
bridge-broken | Guards don't do that. Unless they're not really guards. | close=me @me:.5:shocked:idle cam=push
bridge-broken | I didn't remember crossing the rest. I just remember counting. | cam=right sfx=glass
void | | prop=number:6:19:PLAYERS_LEFT hold=1.6
dorm-night | That night, six of us left. And no news about Noah. | fx=dark cam=creep tag=NIGHT_5
dorm-night | Rina sat next to me in the dark. | @rina:.35:sad:sit+y=60 @me:.65:crying:sit+y=60 fx=dark
dorm-night | rina> [whispering] There's something I didn't tell you. I've been here before. | close=rina @rina:.5:sad:talk
dorm-night | rina> [whispering] Last year. I lost game two. I wore the red suit for a year. | close=rina @rina:.5:sad:talk cam=push
dorm-night | rina> [whispering] They let me play again. If I win, I'm free. If I lose... I'm theirs forever. | close=rina @rina:.5:scared:talk
dorm-night | rina> [whispering] And Kai... the net is real. Your brother's alive. I know where they keep the fallen. | close=rina @rina:.5:determined:talk cam=zoom
control | She knew the vents. We crawled for twenty minutes. | @rina:.3:determined:crouch+y=80 @me:.6:determined:crouch+y=80 cam=right fx=dark
vip | And we came out above a room where people in gold masks were drinking champagne. | cam=down @vip:.22:grin:sit+y=10 @vip:.78:smug:sit+y=10+flip
vip | They were betting on us. On every game. Laughing. | cam=push sfx=whisper @vip:.22:grin:talk+y=10 @vip:.78:smug:point+y=10+flip
vip | And in the middle, with his feet up on a velvet sofa... | cam=zoom @abbott:.5:smug:sit+dim+y=40
vip | ...number 009. Mr. Abbott. ^Alive.^ Watching me on a screen. | @abbott:.5:grin:sit+y=40+size=1.1 cam=push sfx=stinger
vip | abbott> [chuckle] I told you, son. I'm a very good partner. | close=abbott @abbott:.5:grin:talk cam=zoom

== 8
vip | Mr. Abbott wasn't a player. He was the man who built this game. | close=abbott @abbott:.5:smug:idle t=black cam=push
vip | abbott> [calm] Every year I play once. Down there with you. It's the only place I feel alive. | close=abbott @abbott:.5:smile:talk
vip | Rina pulled me back into the vent before the guards looked up. | @rina:.4:scared:hush+y=80 @me:.65:shocked:idle+y=80 fx=dark cam=shake
control | Behind the control room was a door marked *NET.* | @rina:.35:determined:point+y=60 cam=push
control | Inside: a hospital ward. Thirty beds. Every one of them a player who fell. | cam=right
hospital | And in the last bed... Noah. Bandaged. Breathing. | @noah:.45:sleep:lie+y=-205+size=.8 @me:.82:crying:idle+y=60 cam=push
hospital | And sitting next to him, still in his torn red suit... | cam=zoom
hospital | ...my dad. He'd caught him. Twelve meters down. With his own body. | @dadface:.75:pain:sit+y=40 @noah:.4:sleep:lie+y=-205+size=.8 cam=push
hospital | dadface> [sad] Hi, kiddo. Sorry I'm late. Three years late. | close=dadface @dadface:.5:sad:talk
hospital | For the first time in three years, I let him hug me. | @dadface:.4:crying:hug+y=60 @me:.6:crying:hug+y=60 cam=creep
hospital | Then the speakers crackled. | sfx=buzz cam=up
hospital | host> [calm] Player 218. Final game in ten minutes. ^One opponent.^ | rule=FINAL_GAME cam=push
hospital | The door opened. Two guards. And behind them... | cam=zoom
hospital | Rina. In a red suit again. | @rina:.5:sad:idle+y=60 cam=push
hospital | rina> [crying] I'm sorry, Kai. I made a deal. They told me if I bring you to the net, I'm free. | close=rina @rina:.5:crying:talk
hospital | So the final opponent... was Noah. My brother. Still bleeding. | close=noah @noah:.5:pain:idle cam=zoom sfx=stinger

== 9
rain | The final game was in the rain. A square drawn in the sand. Two brothers. | @me:.3:sad:idle+y=120 @noah:.7:scared:idle+y=120 t=black cam=push
rain | host> [calm] The rules are simple. Get your opponent out of the square. The winner takes it all. | rule=FINAL_GAME cam=zoom
rain | ^Forty-five million^ dollars. Hanging over our heads in a glass pig. | cam=up
rain | Noah could barely stand. One push and it was over. | close=noah @noah:.5:pain:idle
rain | noah> [crying] Do it, Kai. Mum needs you more than me. | close=noah @noah:.5:crying:talk cam=push
rain | I walked to the edge of the square. | @me:.45:sad:walk+to=.15+y=120 cam=left
rain | And I put one foot outside. | close=me @me:.5:determined:idle cam=zoom
rain | host> [angry] Player 218. That is a ^forfeit.^ | cam=shake sfx=buzz
rain | I said I know. I said I quit. Give it to him. | close=me @me:.5:determined:idle
rain | The host stood up. For the first time, he walked onto the field himself. In the doll mask. | @host:.5:blank:walk+to=.55+y=80 cam=push sfx=steps
rain | host> You can't quit, Kai. Not when the whole room has ^money on you.^ | close=host @host:.5:blank:talk cam=zoom
rain | He pulled off the mask. | t=flash sfx=sub cam=shake
rain | It wasn't Abbott. | cam=push
rain | It was the man from the subway. The man in the suit. | close=suit @suit:.5:smug:idle cam=zoom
rain | suit> [calm] Every winner of this game becomes the next host, Kai. Abbott won forty years ago. I won twenty. | close=suit @suit:.5:smile:talk
rain | suit> [whispering] And tonight... I'm retiring. | close=suit @suit:.5:grin:talk cam=push sfx=stinger

== 10
rain | So that was the prize. Not forty-five million. The ^whole game.^ | close=suit @suit:.5:smug:idle t=black cam=push
rain | And if I quit... Noah won. And Noah would become the host. My little brother. Running all of this. | close=noah @noah:.5:scared:idle cam=zoom
rain | So I stepped back into the square. | @me:.15:determined:walk+to=.35+y=120 cam=right
rain | And I said: Fine. I'll win. | close=me @me:.5:determined:idle cam=push
rain | I gently guided Noah out of the square. He didn't fight me. | @me:.45:sad:reach+y=120 @noah:.62:crying:walk+to=.85+y=120 cam=right
arena | They gave me a gold mask. A room full of screens. The keys to everything. | cam=up t=flash
control | And the first thing I did as host... was open every door. | @me:.5:determined:point+y=60+size=1.1 cam=push sfx=alarm
control | Every guard. Every player in the net. Every red suit. | fx=cctv cam=creep
arena | Three hundred people walked out into the sunlight that morning. My dad carried Noah. | @dadface:.4:crying:carry+y=150 @rina:.7:relief:walk+to=.9+y=150 cam=right
arena | The money? I gave it to every player who ever fell. Forty-five million. Split three hundred ways. | prop=number:150000:0:EACH hold=2.3
hospital | Mum had her surgery. She's fine. She still doesn't know where the money came from. | @mum:.45:smile:sit+y=40 @noah:.75:smile:idle+y=60 cam=push tag=ONE_YEAR_LATER
subway | Last week, I was on the subway. | cam=creep
subway | A woman sat down next to me. She held out a ^gold card.^ | @me:.7:shocked:idle+y=60 @rina:.3:smile:idle+y=60 cam=push
subway | rina> [whispering] Abbott built more than one game, Kai. There are ^six^ others. | close=rina @rina:.5:smug:talk cam=zoom
subway | | prop=ticket:PLAY:GAME_2_OF_7:#c9a23a hold=2.4 sfx=stinger
