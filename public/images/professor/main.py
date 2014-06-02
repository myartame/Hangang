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
    urlArr = ["03_01_01.html&mainFrame=right&dum=dum&command=teacher_list&viewHakgwajojikCd=H3HADA&language=kor&viewStructureSeq=416",
              "03_01_01.html&mainFrame=right&dum=dum&command=teacher_list&viewHakgwajojikCd=H3HAEA&language=kor&viewStructureSeq=406",
              "03_01_01.html&mainFrame=right&dum=dum&command=teacher_list&viewHakgwajojikCd=H3HADB&language=kor&viewStructureSeq=409",
              "03_01_01.html&mainFrame=right&dum=dum&command=teacher_list&viewHakgwajojikCd=H3HAAD&language=kor&viewStructureSeq=240",
              "03_01_01.html&mainFrame=right&dum=dum&command=teacher_list&viewHakgwajojikCd=H3HANO&language=kor&viewStructureSeq=245",
              "03_01_01.html&mainFrame=right&dum=dum&command=teacher_list&viewHakgwajojikCd=H3HADG&language=kor&viewStructureSeq=345",
              "03_01_01.html&mainFrame=right&dum=dum&command=teacher_list&viewHakgwajojikCd=H3HADD&language=kor&viewStructureSeq=411",
              "03_01_01.html&mainFrame=right&dum=dum&command=teacher_list&viewHakgwajojikCd=H3HADE&language=kor&viewStructureSeq=412",
              "03_01_01.html&mainFrame=right&dum=dum&command=teacher_list&viewHakgwajojikCd=H3HADF&language=kor&viewStructureSeq=413",
              "03_01_01.html&mainFrame=right&dum=dum&command=teacher_list&viewHakgwajojikCd=H3HADF001&language=kor&viewStructureSeq=574",
              ]
    for url in urlArr:
        getProfessorPhoto("http://www.hanyang.ac.kr/user/indexSub.action?codyMenuSeq=1693&siteId=hanyangkr2&menuType=T&uId=3&sortChar=AAA&menuFrame=&linkUrl="
                          + url)