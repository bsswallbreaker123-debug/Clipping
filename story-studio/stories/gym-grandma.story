title: Gym Grandma
id: gym-grandma
narrator: bm_george
music: quirky
accent: #ff4fa3
tempo: 1.18

cast:
  me: Milo | kid | hair=messy:#5a3a22 | top=#2f8ad8:hoodie | skin=#f6d7bf | voice=am_puck+4
  gran: Grandma Gertie | old | hair=bun:#e8e4dc | top=#e8509a:jacket | top2=#ffffff | glasses | wrinkles | skin=#f2cdb0 | voice=bf_emma+-3
  tony: Big Tony | adult | hair=buzz:#2a1a12 | top=#c0242c:shirt | build=1.6 | height=1.18 | beard=stubble | skin=#e0a77f | voice=am_onyx
  mayor: The Mayor | adult | hair=side:#3a2a1a | top=#22252c:suit | top2=#f1f1f1 | glasses | voice=am_michael
  mail: Steve | adult | hair=cap:#2a4a8a | top=#3a5a9a:uniform | skin=#c98a5f | voice=am_eric
  baker: Baker Bob | adult | hair=bald | top=#f4f4f4:shirt | build=1.3 | beard=full | voice=am_adam

scenes:
  street: outside sky=day far=hills ground=road light=day | house .2 s=.6 y=-40 c=#f2b8c6 | house .8 s=.6 y=-40 c=#bfe3f0 | streetlamp .5 v=off
  garden: outside sky=day far=hills ground=grass light=day | house .5 s=.9 c=#f6e2a8 | fence .5 y=-30
  garage: room wall=#c8ccd2:concrete floor=#8a8e96:concrete light=cold | car .72 c=#e8c22a | shelf .18 | lamp .45
  kitchen: room wall=#f2e6c8:tile floor=#c8b89a:check light=warm | fridge .78 | counter .32 c=#8a6a4a | window .5 y=-700
  park: outside sky=day far=hills ground=grass light=day | crowd .5 v=14 y=80 c=#5a5a68 | sign .84 v=STRONGEST_IN_TOWN c=#ffd23a | lights .5 y=-900
  bakery: room wall=#f6d8b8:stripes floor=#c8a07a:wood light=warm | counter .5 c=#c88a4a | window .2 y=-700 | picture .82
  void: void

== 1
garden | My grandma is ninety-seven years old. And she has ^never^ skipped leg day. | cam=push @gran:.5:smug:arms+y=80 @me:.78:shocked:idle+y=100
garage | Rep, rep, rep, rep, rep! | cam=punch fx=shake sfx=impact @gran:.5:determined:hands-up+y=60
kitchen | Every morning she lifts the fridge. Just to get the butter. | cam=push @gran:.62:determined:hands-up+y=60 @me:.25:shocked:idle+y=100
street | Then she lifts the mailman. Just to say hi. | cam=right @gran:.35:smile:hands-up+y=80 @mail:.68:terrified:hands-up+y=80 sfx=pop
street | mail> Ma'am. Please put me down. | close=mail @mail:.5:terrified:talk
garage | Rep, rep, rep, rep, rep! | cam=punch fx=shake sfx=impact @gran:.5:determined:fists+y=60
street | But the whole town laughed at her. | cam=push @mayor:.3:grin:point+y=80 @baker:.7:grin:point+y=80 sfx=crowd
street | mayor> Grandmas don't lift. Grandmas knit. | close=mayor @mayor:.5:smug:talk
park | Then came the biggest day of the year. The Strongest in Town contest. | cam=up tag=SATURDAY sfx=crowd
park | And the champion for twelve years in a row. ^Big Tony.^ | cam=zoom @tony:.5:smug:arms+y=60+size=1.15 sfx=boom
park | tony> Go home, granny. This is for real men. | close=tony @tony:.5:smug:talk
park | Grandma didn't say a word. She just put down her knitting. | cam=push @gran:.35:determined:idle+y=80 @tony:.7:grin:arms+y=60+size=1.15
garage | Rep, rep, rep, rep, rep! | cam=punch fx=shake sfx=impact @gran:.5:angry:hands-up+y=60
park | She lifted the weights. Then she lifted Big Tony. With ^one hand.^ | cam=shake t=flash @gran:.42:determined:hands-up+y=80 @tony:.62:terrified:hands-up+y=-120+size=1.15 sfx=boom
park | The crowd went silent. | cam=still @me:.5:shocked:idle+y=100
park | Big Tony cried. A little bit. | close=tony @tony:.5:crying:idle
park | gran> Now be a dear and pass me my knitting. | close=gran @gran:.5:smile:talk
street | The next morning, I heard something from every single garage in town. | cam=up tag=NEXT_MORNING
garage | Rep, rep, rep, rep, rep! | cam=punch fx=shake sfx=impact @mail:.3:determined:hands-up+y=60 @mayor:.7:determined:hands-up+y=60
park | The mailman got huge. The mayor got huge. Even the baker got huge. | cam=right @mail:.2:grin:fists+y=80+size=1.2 @mayor:.5:grin:fists+y=80+size=1.2 @baker:.8:grin:fists+y=80+size=1.25 sfx=levelup
bakery | Which is great. Except now nobody fits through the bakery door. | cam=zoom @baker:.5:sad:arms+y=60+size=1.35 sfx=pop
garden | And grandma? She finally quit lifting. Now she only does cardio. | cam=push @gran:.5:smile:idle+y=80
street | Run, run, run, run, run! | cam=punch fx=shake sfx=whoosh @gran:.15:grin:run+to=.85+y=80 @me:.5:shocked:idle+y=100
