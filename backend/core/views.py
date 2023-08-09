from ninja import NinjaAPI
from ninja.files import UploadedFile
from core import services


api = NinjaAPI()


@api.post("/submit_csv_register/")
def submit_csv_register(request, files: list[UploadedFile]):
    created = services.handle_csv_schedule(files)
    num_of_files = len(created)
    print(num_of_files)
    return 200, {"success": True}
