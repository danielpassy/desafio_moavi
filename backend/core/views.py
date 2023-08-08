from ninja import NinjaAPI, File
from ninja.files import UploadedFile

api = NinjaAPI()


@api.post("/submit_csv_register/")
def submit_csv_register(request, files: list[UploadedFile] = File(...)):
    num_of_files = len(files)
    print(num_of_files)
    return 200, {"success": True}
