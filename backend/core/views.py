from ninja import NinjaAPI, File
from ninja.files import UploadedFile

api = NinjaAPI()


@api.post("/submit_csv_register/")
def submit_csv_register(request, file: UploadedFile = File(...)):
    data = file.read()
    print(data)
    return 200, {"success": True}
