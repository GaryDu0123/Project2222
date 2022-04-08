from django.contrib.auth.models import User
from django.db.models import Q
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from chat.models import FriendRelationship, MessageRecord
import utils

# Create your views here.
def test(request):
    return render(request, "api/chatApiTest.html")


def api_response(request):
    if not request.user.is_authenticated:
        return JsonResponse({
            "warning": "login required"
        })
    return HttpResponse("Hello World")


def get_user_friend_box(request):
    if not request.user.is_authenticated:
        return JsonResponse({
            "warning": "login required"
        })
    user = request.user
    friend_list = {}
    count = 0
    for friend in FriendRelationship.objects.filter(user_1=user):
        friend_list[count] = friend.user_2.username
        count += 1
    for friend in FriendRelationship.objects.filter(user_2=user):
        friend_list[count] = friend.user_1.username
        count += 1
    return JsonResponse(friend_list)


# def get_user_friend_box(request):
#     return JsonResponse({
#         "0": "test0",
#         "1": "test1",
#         "2": "test2",
#         "3": "test3",
#         "4": "test4",
#         "5": "test5",
#     })


def get_message(request):
    return JsonResponse({
        "0": {
            "content": "《点兔》作品的舞台设定在一个以欧洲传统风格为基调的架空世界。作者广泛参考了法国斯特拉斯堡、科尔马的街道，以及匈牙利的温泉国际象棋等各式各样的元素，作为舞台设计的范本。",
            "from": "sender"
        },
        "1": {
            "content": "其中，主角们所在的“木结构小镇”（木組みの街）以现实中德国、法国东部的“半木结构民居”为蓝本，这种房屋的木框架裸露在墙体外，形成别具特色的风格。在作品中具有核心地位的咖啡店Rabbit House即为该风格的代表。小镇上既有贵族气质浓郁的大小姐高中，也有推出半工半读项目、广泛吸引小镇外各地学子的平民学校。此外，遍布在小镇各地、随处可见的野兔子，也是小镇的一大特色，小镇上的人们通过各种方式纪念兔子的同时，也不知不觉地染上了兔子的气质。",
            "from": "receiver"
        },
        "2": {
            "content": "此外，主角们毕业旅行期间前往的“百桥闪耀之都”（百の橋と輝きの都），则似乎以旧称为“桥间之城”的斯德哥尔摩老城区为蓝本。",
            "from": "sender"
        },
        "3": {
            "content": "与西洋风格的街市相对的是，剧中的世界同时也存在日式校服、花火大会、文化祭等很多日式元素。也因此，即便是像甘兔庵这样的和风茶饮店也可以毫无违和感地融入进来。",
            "from": "receiver"
        },
        "4": {
            "content": "虽然剧中人物大体保持了互联网诞生之前的生活习惯，但在需要的时候也可以自如使用手机等高科技的事物。",
            "from": "sender"
        },
    })


def initialize_chat_box(request):
    if not request.user.is_authenticated:
        return JsonResponse({
            "warning": "login required"
    })
    user1 = request.user
    user2 = User.objects.get(username=request.POST["receiver"])
    if not utils.is_friend(user1, user2):
        return HttpResponse(status=403)

    query_result = MessageRecord.objects.filter(
        Q(sender=user1, receiver=user2) | Q(sender=user2, receiver=user1)
    ).order_by('message_id')
    ret_dic = {}
    counter = 0
    for result in query_result:
        ret_dic[str(counter)] = {
            "content": result.message,
            "from": "sender" if result.sender == user1 else "receiver"
        }
        counter += 1
    return JsonResponse(ret_dic)
