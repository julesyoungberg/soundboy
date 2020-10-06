import freesound

client = freesound.FreesoundClient()
client.set_token("J4XiwSsuIaqGVTj8SHgXoA7lURZ6CgAw7aHchkoT","token")

# change the query to modify the scearch
results = client.text_search(query="drum",fields="id,name,previews")


for sound in results:
    sound.retrieve_preview(".",sound.name+".mp3")
    print(sound.name)