from datetime import date
from django.forms import model_to_dict
from ninja import NinjaAPI
from ninja.files import UploadedFile
from core import services

api = NinjaAPI()


@api.post("/files/")
def upload_csv_file(request, files: list[UploadedFile]):
    created = services.handle_csv_files(files)
    num_of_files = len(created)
    print(num_of_files)
    return 200, {"success": True}


@api.get("/files/")
def list_uploaded_files(request):
    files = services.get_file_records()
    return 200, {
        "files": [
            {
                "file_name": f.file.name,
                **model_to_dict(f, exclude=["file"]),
            }
            for f in files
        ]
    }


@api.get("/escalas/")
def get_escalas_for_a_specific_day(request, day: date):
    escalas = services.get_escala_for_a_day(day)
    return 200, {
        "escalas": [
            {
                "file": {"id": s.file_id, "file_name": s.file.file.name},
                **model_to_dict(s, exclude=["file"]),
            }
            for s in escalas
        ]
    }
