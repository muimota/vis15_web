
import json
f = open('validThings.csv','r')

lines = f.readlines();

things = []

for thing in lines:
	thing = thing.strip()
	things.append(thing)

f.close()

f = open('things.js','w')
json.dump(things,f)

