from datetime import date
from django.forms import model_to_dict
from ninja import NinjaAPI
from ninja.files import UploadedFile
from core import services

api = NinjaAPI()


@api.post("/file_register/")
def submit_csv_register(request, files: list[UploadedFile]):
    created = services.handle_csv_schedule(files)
    num_of_files = len(created)
    print(num_of_files)
    return 200, {"success": True}


@api.get("/file_register/")
def get_file_register(request):
    files = services.get_file_register()
    return 200, {
        "files": [
            {
                "file_name": f.file.name,
                **model_to_dict(f, exclude=["file"]),
            }
            for f in files
        ]
    }


@api.get("/schedules/")
def get_schedule_register_for_a_day(request, day: date):
    schedules = services.get_schedule_register_for_a_day(day)
    return 200, {"schedules": [model_to_dict(s) for s in schedules]}
