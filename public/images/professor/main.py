import urllib
import urllib2

def getProfessorPhoto(url):
    rs = urllib2.Request(url)
    response = urllib2.urlopen(rs)
    source = response.read().decode("euc-kr").split("<img src=\"http://www.hanyang.ac.kr/image/photo/kyosu/")

    for i in range(1, len(source), 1):
        photo = open(source[i].split("\" alt=\"")[1].split("<dt>")[1].split(" <span>")[0] + ".jpg", "wb")
        photo.write(urllib.urlopen("http://www.hanyang.ac.kr/image/photo/kyosu/" + source[i].split("\" alt=\"")[0]).read())
        photo.close()

if __name__ == "__main__":
    urlArr = [
            "H3HNCO&language=kor&viewStructureSeq=1081",

            "H3IAAA&language=kor&viewStructureSeq=415",
            "H3IAAB&language=kor&viewStructureSeq=1138",

            "H3HPJA&language=kor&viewStructureSeq=275",
      
            "H3HWAB&language=kor&viewStructureSeq=279",
         
            "H3HRKG&language=kor&viewStructureSeq=276",
            "H3HRKH&language=kor&viewStructureSeq=414",
       
            "H3HGLA&language=kor&viewStructureSeq=258",
            "H3HGLB&language=kor&viewStructureSeq=259",
            "H3HGLC&language=kor&viewStructureSeq=260",
            "H3HGLD&language=kor&viewStructureSeq=261",
            "H3HGLH&language=kor&viewStructureSeq=264",
            "H3HGLF&language=kor&viewStructureSeq=262",
       
            "H3HTEI&language=kor&viewStructureSeq=1098",
            "H3HTEJ&language=kor&viewStructureSeq=1099",
            "H3HTEK&language=kor&viewStructureSeq=1100",

            "H3HHMA&language=kor&viewStructureSeq=265",
            "H3HHMB&language=kor&viewStructureSeq=251",
            "H3HHMC&language=kor&viewStructureSeq=266",
            "H3HHMD&language=kor&viewStructureSeq=252",
            "H3HHME&language=kor&viewStructureSeq=267",

            "H3IBAA&language=kor&viewStructureSeq=1089",
            "H3IBAB&language=kor&viewStructureSeq=1092",
            "H3IBAC&language=kor&viewStructureSeq=1091",
            "H3IBAD&language=kor&viewStructureSeq=1090"
        ]
    for url in urlArr:
        getProfessorPhoto("http://www.hanyang.ac.kr/user/indexSub.action?codyMenuSeq=1693&siteId=hanyangkr2&menuType=T&uId=3&sortChar=AAA&menuFrame=&linkUrl=03_01_01.html&mainFrame=right&dum=dum&command=teacher_list&viewHakgwajojikCd="
                          + url)
        print(url)




























